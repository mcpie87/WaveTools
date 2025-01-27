require_relative 'utils'

skilldescription = load_file("#{DATAMINE_PATH}/#{BINDATA}/skill/skilldescription.json")
skill = load_file("#{DATAMINE_PATH}/#{BINDATA}/skill/skill.json")

iteminfo = load_file("#{DATAMINE_PATH}/#{BINDATA}/item/iteminfo.json")

data = []
iteminfo.each do |row|
    new_row = {
        id: row["Id"],
        name: get_textmap_name(row["Name"]),
        attributes_description: row["AttributesDescription"],
        bg_description: row["BgDescription"],
        icon: convert_to_png(row["Icon"]),
        icon_middle: convert_to_png(row["IconMiddle"]),
        icon_small: convert_to_png(row["IconSmall"]),
        rarity: row["QualityId"],
    }
    data << new_row unless new_row[:name].nil?
    # puts("#{new_row[:id]}  #{new_row[:rarity]} #{new_row[:name]}")
end

save_json(data, "items.json")