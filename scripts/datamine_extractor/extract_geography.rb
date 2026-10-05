require_relative 'utils'

@area_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/area/area.json", false, "AreaId")
@areareport_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/area/areareport.json", true)

data = []
@areareport_config.each do |row|
  next if row["PicResource"].empty?
  new_row = {
    name: get_textmap_name(@area_config[row["AreaId"]]["Title"]),
    url: convert_to_webp(row["PicResource"]),
  }
  data << new_row
end  

save_json(data, "geography.json")

# # save as csv
csv_data = []
data.each do |row|
  new_row = []
  new_row << row[:name]
  new_row << row[:url]
  csv_data << new_row
end

save_csv(csv_data, "geography.csv")