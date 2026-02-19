

import asyncio
import os
import json
from datetime import datetime, timedelta
from typing import Optional
import kuro
from kuro import types
import requests
from getpass import getpass
from pprint import pprint

# Cache variables
_avatar_mapping_cache = None
_role_skin_cache = None

# Helper functions
def load_avatar_mapping():
    global _avatar_mapping_cache

    if _avatar_mapping_cache is not None:
        return _avatar_mapping_cache

    try:
        response = requests.get("https://files.wuthery.com/d/GameData/ConfigDBParsed/PlayerHeadRe.json")
        response.raise_for_status()
        data = response.json()

        _avatar_mapping_cache = {}
        for item in data:
            avatar_id = item.get('Id')
            if avatar_id:
                _avatar_mapping_cache[avatar_id] = {
                    'icon_256': item.get('Icon', ''),
                    'icon_160': item.get('IconMiddle', ''),
                    'icon_80': item.get('IconSmall', ''),
                    'role_skin_id': item.get('RoleSkinId', None),
                    'sort_index': item.get('SortIndex', None)
                }

        return _avatar_mapping_cache
    except Exception as e:
        print(f"Warning: Could not load avatar mapping: {e}")
        return {}

def load_role_skin_mapping():
    global _role_skin_cache

    if _role_skin_cache is not None:
        return _role_skin_cache

    try:
        response = requests.get("https://files.wuthery.com/d/GameData/ConfigDBParsed/RoleSkin.json")
        response.raise_for_status()
        data = response.json()

        _role_skin_cache = {}
        for item in data:
            role_skin_id = item.get('Id')
            if role_skin_id:
                _role_skin_cache[role_skin_id] = {
                    'role_head_icon_large': item.get('RoleHeadIconLarge', '')
                }

        return _role_skin_cache
    except Exception as e:
        print(f"Warning: Could not load role skin mapping: {e}")
        return {}

def get_avatar_icon_url(avatar_id: int) -> Optional[str]:
    if avatar_id < 10_000:
        return f"https://files.wuthery.com/d/GameData/UIResources/Common/Image/IconRoleHead256/{avatar_id}.png"

    mapping = load_avatar_mapping()

    if avatar_id in mapping:
        icon_path = mapping[avatar_id]['icon_256']

        if icon_path:
            icon_path = icon_path.split('.')[0]
            return f"https://files.wuthery.com/d{icon_path}.png"

        role_skin_id = mapping[avatar_id].get('role_skin_id')

        if role_skin_id:
            role_skin_mapping = load_role_skin_mapping()

            if role_skin_id in role_skin_mapping:
                role_head_icon_large = role_skin_mapping[role_skin_id].get('role_head_icon_large', '')

                if role_head_icon_large:
                    icon_path = role_head_icon_large.split('.')[0]
                    return f"https://files.wuthery.com/d{icon_path}.png"

    return None

def load_cached_tokens():
    try:
        with open('kuro_tokens.json', 'r') as f:
            token_data = json.load(f)

        expiry_time = datetime.fromisoformat(token_data.get('expiry_time', ''))
        if datetime.now() < expiry_time:
            return token_data
        return None
    except (FileNotFoundError, json.JSONDecodeError, ValueError, KeyError):
        return None

def save_tokens(login_result, token_result, oauth_code):
    try:
        expiry_time = datetime.now() + timedelta(minutes=55)

        token_data = {
            'login_result': {
                'user_id': getattr(login_result, 'id', None) or getattr(login_result, 'user_id', None),
                'username': getattr(login_result, 'username', None),
                'code': login_result.code,
                'token': getattr(login_result, 'token', None)
            },
            'token_result': {
                'access_token': token_result.access_token,
                'refresh_token': getattr(token_result, 'refresh_token', None),
                'expires_in': getattr(token_result, 'expires_in', 3600)
            },
            'oauth_code': oauth_code,
            'expiry_time': expiry_time.isoformat(),
            'created_time': datetime.now().isoformat()
        }

        with open('kuro_tokens.json', 'w') as f:
            json.dump(token_data, f, indent=2)
    except Exception as e:
        print(f"Failed to save tokens: {e}")

async def get_or_refresh_tokens(client, email, password):
    cached_tokens = load_cached_tokens()

    if cached_tokens:
        class MockLoginResult:
            def __init__(self, data):
                self.id = data.get('user_id')
                self.user_id = data.get('user_id')
                self.username = data.get('username')
                self.code = data.get('code')
                self.token = data.get('token')

        class MockTokenResult:
            def __init__(self, data):
                self.access_token = data.get('access_token')
                self.refresh_token = data.get('refresh_token')
                self.expires_in = data.get('expires_in', 3600)

        login_result = MockLoginResult(cached_tokens['login_result'])
        token_result = MockTokenResult(cached_tokens['token_result'])
        oauth_code = cached_tokens['oauth_code']

        return login_result, token_result, oauth_code
    else:
        login_result = await client.game_login(email, password)
        token_result = await client.get_game_token(login_result.code)
        oauth_code = await client.generate_oauth_code(token_result.access_token)
        save_tokens(login_result, token_result, oauth_code)

        return login_result, token_result, oauth_code
     


email = getpass(prompt="Email: ")
password = getpass(prompt="Password: ")


async def fetch_all_launcher_info(email, password):
    if not email or not password:
        print("Error: Email or password not provided.")
        return

    export_data = {}
    player_id = None

    try:
        print("Wuthering Waves Account Information Fetcher")
        print("=" * 60)

        client = kuro.Client(
            lang=types.Lang.ENGLISH,
            region=types.Region.OVERSEAS
        )

        login_result, token_result, oauth_code = await get_or_refresh_tokens(client, email, password)

        print("\n" + "=" * 60)
        print("AUTHENTICATION INFORMATION")
        print("=" * 60)

        export_data["authentication"] = {
            "user_id": getattr(login_result, 'id', None) or getattr(login_result, 'user_id', None),
            "username": getattr(login_result, 'username', None),
            "login_time": datetime.now().isoformat(),
            "access_token_preview": token_result.access_token[:20] + "..." if token_result.access_token else None
        }

        print(f"Username: {getattr(login_result, 'username', 'N/A')}")
        print(f"Access Token: {token_result.access_token[:50]}...")

        print("\n" + "=" * 60)
        print("PLAYER INFORMATION")
        print("=" * 60)

        try:
            player_info = await client.get_player_info(oauth_code)

            if player_info:
                print(f"Found player data for {len(player_info)} regions:")

                export_data["player_regions"] = {}

                for region, info in player_info.items():
                    print(f"\nRegion: {region}")
                    print(f"   UID: {info.uid}")
                    print(f"   Name: {info.name}")
                    print(f"   Level: {info.level}")
                    print(f"   Sex: {info.sex}")
                    print(f"   Avatar ID: {info.avatar_id}")

                    avatar_icon_url = get_avatar_icon_url(info.avatar_id)
                    export_data["player_regions"][region] = {
                        "uid": info.uid,
                        "name": info.name,
                        "level": info.level,
                        "sex": getattr(info, 'sex', None),
                        "avatar_id": getattr(info, 'avatar_id', None),
                        "avatar_icon_url": avatar_icon_url
                    }

                highest_level_region = ""
                highest_level = 0
                highest_level_uid = 0

                for region, info in player_info.items():
                    if info.level > highest_level:
                        highest_level = info.level
                        highest_level_region = region
                        highest_level_uid = info.uid

                player_id = highest_level_uid

                print(f"\nHighest level player found: Level {highest_level} in {highest_level_region}")
                print(f"Fetching detailed role info for {highest_level_region} (UID: {highest_level_uid})...")

                try:
                    role_info = await client.get_player_role(oauth_code, highest_level_uid, highest_level_region)

                    print("\n" + "=" * 60)
                    print("DETAILED PLAYER STATISTICS")
                    print("=" * 60)

                    basic = role_info.basic
                    print(f"Player Name: {basic.name}")
                    print(f"Player ID: {basic.id}")
                    print(f"Creation Time: {basic.create_time}")
                    print(f"Level: {basic.level}")
                    print(f"World Level: {basic.world_level}")
                    print(f"Active Days: {basic.active_days}")
                    print(f"Character Count: {basic.character_count}")
                    print(f"Sonance Caskets: {basic.sonance_cascet_count}")

                    print(f"\nENERGY SYSTEM:")
                    print(f"   Current Waveplates: {basic.waveplates}/{basic.max_waveplates}")
                    print(f"   Refined Waveplates: {basic.refined_waveplates}")
                    print(f"   Waveplates Replenish: {basic.waveplates_replenish_time}")
                    print(f"   Refined Replenish: {basic.refined_waveplates_replenish_time}")


                    pprint(basic)
                    export_data["detailed_player"] = {
                        "name": basic.name,
                        "id": basic.id,
                        "create_time": str(basic.create_time),
                        "level": basic.level,
                        "world_level": basic.world_level,
                        "active_days": basic.active_days,
                        "character_count": basic.character_count,
                        "sonance_cascet_count": basic.sonance_cascet_count,
                        "energy_system": {
                            "waveplates": basic.waveplates,
                            "max_waveplates": basic.max_waveplates,
                            "refined_waveplates": basic.refined_waveplates,
                            "waveplates_replenish_time": str(basic.waveplates_replenish_time),
                            "refined_waveplates_replenish_time": str(basic.refined_waveplates_replenish_time)
                        }
                    }

                    print(f"\nACTIVITY SYSTEM:")
                    print(f"   Activity Points: {basic.activity_points}/{basic.max_activity_points}")
                    print(f"   Activities Unlocked: {basic.activities_unlocked}")

                    print(f"\nPROGRESS:")
                    print(f"   Current Chapter: {basic.chapter_id}")
                    print(f"   Weekly Challenges Left: {basic.weekly_challenge}")

                    print(f"\nPERSONAL INFO:")
                    print(f"   Birthday: {basic.birthday_month}/{basic.birthday_day}")

                    export_data["detailed_player"].update({
                        "activity_system": {
                            "activity_points": basic.activity_points,
                            "max_activity_points": basic.max_activity_points,
                            "activities_unlocked": basic.activities_unlocked
                        },
                        "progress": {
                            "chapter_id": basic.chapter_id,
                            "weekly_challenge": basic.weekly_challenge
                        },
                        "personal_info": {
                            "birthday_month": basic.birthday_month,
                            "birthday_day": basic.birthday_day
                        }
                    })

                    print(f"\nCOLLECTION STATS:")
                    collections = {}
                    if basic.chests:
                        print("   Chests Collected:")
                        collections["chests"] = {}
                        for chest_type, count in basic.chests.items():
                            print(f"      - {chest_type}: {count}")
                            collections["chests"][chest_type] = count

                    if basic.basic_chests:
                        print("   Basic Chests:")
                        collections["basic_chests"] = {}
                        for chest_type, count in basic.basic_chests.items():
                            print(f"      - {chest_type}: {count}")
                            collections["basic_chests"][chest_type] = count

                    if basic.tidal_heritages:
                        print("   Tidal Heritages:")
                        collections["tidal_heritages"] = {}
                        for heritage_type, count in basic.tidal_heritages.items():
                            print(f"      - {heritage_type}: {count}")
                            collections["tidal_heritages"][heritage_type] = count

                    export_data["detailed_player"]["collections"] = collections

                    bp = role_info.battle_pass
                    print(f"\nBATTLE PASS:")
                    print(f"   Level: {bp.level}")
                    print(f"   Weekly XP: {bp.weekly_xp}/{bp.max_weekly_xp}")
                    print(f"   Unlocked: {bp.is_unlocked}")
                    print(f"   Opened: {bp.is_opened}")
                    print(f"   Total XP: {bp.xp}/{bp.xp_limit}")

                    export_data["detailed_player"]["battle_pass"] = {
                        "level": bp.level,
                        "weekly_xp": bp.weekly_xp,
                        "max_weekly_xp": bp.max_weekly_xp,
                        "is_unlocked": bp.is_unlocked,
                        "is_opened": bp.is_opened,
                        "xp": bp.xp,
                        "xp_limit": bp.xp_limit
                    }

                    bike = role_info.bike
                    print(f"\nBIKE INFO:")
                    print(f"   Level: {bike.level}")
                    print(f"   XP: {bike.xp}/{bike.next_xp}")
                    print(f"   Skins Owned: {len(bike.skins)}")
                    print(f"   Equipped Skin ID: {bike.equipped_skin.id}")
                    export_data["detailed_player"]["bike"] = {
                        "level": bike.level,
                        "xp": bike.xp,
                        "next_xp": bike.next_xp,
                        "skins_count": len(bike.skins),
                        "equipped_skin_id": bike.equipped_skin.id
                    }

                    music = role_info.music
                    total_songs=sum(album.total_count for album in music.albums)
                    collected_songs=sum(album.count for album in music.albums)
                    albums=[
                        {'id': album.id, 'collected': album.count, 'total': album.total_count}
                        for album in music.albums
                    ]
                    print(f"\nMUSIC COLLECTION:")
                    print(f"   Songs Collected: {collected_songs}/{total_songs}")
                    if music.albums:
                        print("   Albums:")
                        for album in music.albums:
                            print(f"      - Album {album.id}: {album.count}/{album.total_count}")
                    export_data["detailed_player"]["music_collection"] = {
                        "total_songs": total_songs,
                        "collected_songs": collected_songs,
                        "albums": albums
                    }

                except Exception as e:
                    print(f"Could not fetch detailed role info: {e}")
                    export_data["detailed_player"] = {"error": str(e)}
            else:
                print("No player information found.")
                export_data["player_regions"] = {}

        except Exception as e:
            print(f"Could not fetch player info: {e}")
            export_data["player_regions"] = {"error": str(e)}
            player_id = export_data["authentication"].get("user_id")

        print("\n" + "=" * 60)
        print("TOKEN STATUS")
        print("=" * 60)

        try:
            remaining_time = await client.check_game_token(token_result.access_token)
            print(f"Token remaining time: {remaining_time} seconds")
            print(f"Token expires in: {remaining_time // 3600}h {(remaining_time % 3600) // 60}m {remaining_time % 60}s")

            cached_tokens = load_cached_tokens()
            if cached_tokens:
                cached_expiry = datetime.fromisoformat(cached_tokens['expiry_time'])
                time_until_cache_expiry = (cached_expiry - datetime.now()).total_seconds()
                print(f"Cached token expires in: {int(time_until_cache_expiry)} seconds")

            export_data["token_status"] = {
                "remaining_time_seconds": remaining_time,
                "expires_in_hours": remaining_time // 3600,
                "expires_in_minutes": (remaining_time % 3600) // 60,
                "using_cached_token": cached_tokens is not None
            }
        except Exception as e:
            print(f"Could not check token status: {e}")
            export_data["token_status"] = {"error": str(e)}

        if player_id:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{player_id}_{timestamp}.json"

            try:
                with open(filename, 'w', encoding='utf-8') as f:
                    json.dump(export_data, f, indent=2, ensure_ascii=False)
                print(f"\nData exported to: {filename}")
            except Exception as e:
                print(f"Error exporting to JSON: {e}")
        else:
            print("\nNo player ID found - cannot create JSON export filename")

        print("\n" + "=" * 60)
        print("LAUNCHER API INFORMATION FETCH COMPLETED!")
        print("=" * 60)

    except Exception as e:
        print(f"Critical error: {e}")
        print(f"Error type: {type(e).__name__}")

async def main():
    await fetch_all_launcher_info(email, password)

if __name__ == "__main__":
    asyncio.run(main())