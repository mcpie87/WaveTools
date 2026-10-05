require_relative 'utils'

iteminfo = load_file("#{DATAMINE_PATH}/#{BINDATA}/item/iteminfo.json", true)

data = []
iteminfo.each do |row|
    new_row = {
        id: row["Id"],
        name: get_textmap_name(row["Name"]),
        attributes_description: get_textmap_name(row["AttributesDescription"]),
        bg_description: get_textmap_name(row["BgDescription"]),
        icon: convert_to_png(row["Icon"]),
        icon_middle: convert_to_png(row["IconMiddle"]),
        icon_small: convert_to_png(row["IconSmall"]),
        rarity: row["QualityId"],
    }
    data << new_row unless new_row[:name].nil?
    puts("#{new_row[:id]}  #{new_row[:rarity]} #{new_row[:name]}")
end

save_json(data, "items.json")

# save as csv
csv_data = []
data.each do |row|
  new_row = []
  new_row << row[:id]
  new_row << row[:name]
  new_row << row[:rarity]
  new_row << row[:icon]
  new_row << row[:icon_middle]
  new_row << row[:icon_small]
  csv_data << new_row
end

save_csv(csv_data, "items.csv")