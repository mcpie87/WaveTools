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


# monster info
@mobinfo = load_file("#{DATAMINE_PATH}/#{BINDATA}/monster_info/monsterinfo.json")
# monster growth
@mobgrowth = load_file("#{DATAMINE_PATH}/#{BINDATA}/property/monsterpropertygrowth.json", true)
# base mob stats
@base_stats_info = load_file("#{DATAMINE_PATH}/#{BINDATA}/property/baseproperty.json")
# mob -> stat mapping
@calabash_develop = load_file("#{DATAMINE_PATH}/#{BINDATA}/calabash/calabashdevelopreward.json", true)
# general item info
@iteminfo = load_file("#{DATAMINE_PATH}/#{BINDATA}/item/iteminfo.json")

# contains havoc etc info
@elementinfo = load_file("#{DATAMINE_PATH}/#{BINDATA}/element_info/elementinfo.json")

def get_element(id)
    {
        id: id,
        name: get_textmap_name(@elementinfo[id]["Name"]),
        icon: convert_to_png(@elementinfo[id]["Icon4"])
    }
end

def extract_stats(row)
  return nil if row.nil?
  {
    HP: row["LifeMax"],
    ATK: row["Atk"],
    DEF: row["Def"],
    resistances: {
      Physical: row["DamageResistancePhys"],     # 0
      Glacio:   row["DamageResistanceElement1"], # 1
      Fusion:   row["DamageResistanceElement2"], # 2
      Electro:  row["DamageResistanceElement3"], # 3
      Aero:     row["DamageResistanceElement4"], # 4
      Spectro:  row["DamageResistanceElement5"], # 5
      Havoc:    row["DamageResistanceElement6"], # 6
    }
  }
end

data = []
@mobinfo.each do |mob_id, mob_value|
  calabash_row = @calabash_develop.find{|e| e["MonsterInfoId"] == mob_id}
  new_row = {
    id: mob_value["Id"],
    name: get_textmap_name(mob_value["Name"]),
    rarity: mob_value["RarityId"],
    element: mob_value["ElementIdArray"].map{|e| get_element(e)[:name]},
    icon: convert_to_png(mob_value["Icon"]),
    stats: calabash_row.nil? ? nil : extract_stats(@base_stats_info[calabash_row["MonsterId"]]),
  }
  data << new_row
  puts("#{new_row[:id]}  #{new_row[:rarity]} #{new_row[:name]}")
end

save_json(data, "monsters.json")

# save as csv
csv_data = []
data.each do |row|
  new_row = []
  new_row << row[:id]
  new_row << row[:name]
  new_row << row[:rarity]
  new_row << row[:element].join(",")
  new_row << row[:icon]
  unless row[:stats].nil?
    new_row << row[:stats][:HP]
    new_row << row[:stats][:ATK]
    new_row << row[:stats][:DEF]
    new_row << row[:stats][:resistances][:Physical]
    new_row << row[:stats][:resistances][:Glacio]
    new_row << row[:stats][:resistances][:Fusion]
    new_row << row[:stats][:resistances][:Electro]
    new_row << row[:stats][:resistances][:Aero]
    new_row << row[:stats][:resistances][:Spectro]
    new_row << row[:stats][:resistances][:Havoc]
  end
  csv_data << new_row
end

save_csv(csv_data, "monsters.csv")