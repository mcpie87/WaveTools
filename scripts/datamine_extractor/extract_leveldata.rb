require_relative 'utils'
require 'set'

@levelplaydata_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/LevelPlayData/levelplaydata.json", true)

data = []
@levelplaydata_config.each do |row|
  rowData = row["Data"]
  data << {
    LevelPlayId: rowData["LevelPlayId"],
    Id: rowData["Id"],
    Key: rowData["Key"],
    mapId: rowData["LevelId"],
    TidName: get_textmap_name(rowData["TidName"]),
    LevelPlayEntityId: rowData["LevelPlayEntityId"],
    LevelPlayMark: rowData["LevelPlayMark"],
    Reference: rowData["Reference"],
    Children: rowData["Children"],
    Type: rowData["Type"],
  }
end

save_json(data, "levelplaydata.json")
puts "Saved #{data.size} levelplaydata."