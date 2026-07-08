require_relative 'utils'

@iteminfo_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/item/iteminfo.json", false, "Id")
@bp_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/battle_pass/battlepassreward.json", true)

@questnodedata_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/QuestNodeData/questnodedata.json", true)
@levelplaydata_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/LevelPlayData/levelplaydata.json", true)
@droppackage_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/drop/droppackage.json")

def deep_find(obj, key)
  case obj
  when Hash
    return obj[key] if obj.key?(key)

    obj.each_value do |value|
      result = deep_find(value, key)
      return result unless result.nil?
    end
  when Array
    obj.each do |value|
      result = deep_find(value, key)
      return result unless result.nil?
    end
  end

  nil
end

def extract_item(item)
  {
    id: item["Id"],
    name: get_textmap_name(item["Name"]),
    attributes_description: get_textmap_name(item["AttributesDescription"]),
    bg_description: get_textmap_name(item["BgDescription"]),
    icon: convert_to_webp(item["Icon"]),
    icon_middle: convert_to_webp(item["IconMiddle"]),
    icon_small: convert_to_webp(item["IconSmall"]),
    rarity: item["QualityId"],
  }
end

data = []
@levelplaydata_config.each do |row|
  reward_id = deep_find(row, "RewardId")
  next unless reward_id

  rewards = get_rewards(reward_id)
  next unless rewards && !rewards.empty?

  row_data = row["Data"]
  data << {
    type: "levelplay",
    id: row_data["Id"],
    key: row_data["Key"],
    title: get_textmap_name(row_data["TidName"]),
    map_id: row_data["InstanceId"],
    entity_id: row_data["LevelPlayEntityId"],
    rewards: rewards,
  }
end  

save_json(data, "droppackages.json")
