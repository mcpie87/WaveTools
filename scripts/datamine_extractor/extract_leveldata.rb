require_relative 'utils'
require 'set'

@levelplaydata_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/LevelPlayData/levelplaydata.json", true)
@levelplaynodedata_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/LevelPlayNodeData/levelplaynodedata.json", true)

levelplaynode_preprocess_data = {}
@levelplaynodedata_config.each do |row|
  key, idx = row["Key"].split("_").map(&:to_i)
  levelplaynode_preprocess_data[key] ||= []
  translation = get_textmap_name(row["Data"]["TidTip"])
  next if translation == "" || translation == "NO CONTENT"
  levelplaynode_preprocess_data[key] << [idx, translation]
end


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
    Translations: levelplaynode_preprocess_data[rowData["Id"]].sort_by{|e| e[0]},
    Condition: rowData.dig("LevelPlayOpenCondition", "Conditions")
  }
end

save_json(data, "levelplaydata.json")
puts "Saved #{data.size} levelplaydata."