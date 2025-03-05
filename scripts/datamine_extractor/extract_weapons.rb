require_relative 'utils'

weapon_types = load_file("#{DATAMINE_PATH}/#{BINDATA}/mapping/mapping.json", true)
  .select{|row| row["FieldName"] == "WeaponType"}
  .map{|e|
  {
    id: e["Value"],
    name: get_textmap_name(e["Comment"]),
    icon: convert_to_png(e["Icon"])
  }}
  .map{|e| [e[:id], e]}
  .to_h


# weapons
@weapon_info = load_file("#{DATAMINE_PATH}/#{BINDATA}/weapon/weaponconf.json", true)
# ascension
@weapon_breach_info = load_file("#{DATAMINE_PATH}/#{BINDATA}/weapon/weaponbreach.json", true);
# general item info
@iteminfo = load_file("#{DATAMINE_PATH}/#{BINDATA}/item/iteminfo.json")

def get_weapon_breach_info(weapon_id)
  @weapon_breach_info
    .select{|e| e["BreachId"] == weapon_id}
    .map{|row|
      {
        rank: row["Level"],
        max: row["LevelLimit"],
        items: [
          {
            id: 2,
            name: get_textmap_name(@iteminfo[2]["Name"]),
            value: row["GoldConsume"]
          },
          row["Consume"].map{|mat|
            {
              id: mat["Key"],
              name: get_textmap_name(@iteminfo[mat["Key"]]["Name"]),
              value: mat["Value"],
            }
          }
        ].flatten
      }
    }
    .sort_by { |row| row[:rank] }
end

data = []
@weapon_info.each do |weapon_value|
    new_row = {
        id: weapon_value["ItemId"],
        name: get_textmap_name(weapon_value["WeaponName"]),
        rarity: weapon_value["QualityId"],
        weaponType: weapon_types[weapon_value["WeaponType"]],
        icon: {
            default: convert_to_png(weapon_value["Icon"]),
            middle: convert_to_png(weapon_value["IconMiddle"]),
            small: convert_to_png(weapon_value["IconSmall"]),
        },
        ascensionMaterials: get_weapon_breach_info(weapon_value["ItemId"])
    }
    data << new_row
    puts("#{new_row[:id]}  #{new_row[:rarity]} #{new_row[:name]}")
end

save_json(data, "weapons.json")

# save as csv
csv_data = []
data.each do |row|
  new_row = []
  new_row << row[:id]
  new_row << row[:name]
  new_row << row[:rarity]
  new_row << row[:weaponType][:name]
  new_row << row[:icon][:small]
  csv_data << new_row
end

save_csv(csv_data, "weapons.csv")