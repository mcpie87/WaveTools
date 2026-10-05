require_relative 'utils'
require 'set'

@questnodedata_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/QuestNodeData/questnodedata.json", true)

data = []
@questnodedata_config.each do |row|
  rowData = row["Data"]
  next unless rowData

  locations = rowData.dig("TrackTarget", "TrackType", "Locations")
  next unless locations && !locations.empty?

  data << {
    Key: row["Key"],
    Id: rowData["Id"],
    Type: rowData["Type"],
    Desc: rowData["Desc"],
    ParentNodeId: rowData["ParentNodeId"],
    RewardId: rowData["RewardId"],
    TidTip: get_textmap_name(rowData["TidTip"]),
    TrackTarget: rowData["TrackTarget"],
    Condition: rowData["Condition"],
    EnterActions: rowData["EnterActions"],
    FinishActions: rowData["FinishActions"],
  }
end

save_json(data, "questnode_locations.json")
puts "Saved #{data.size} quest nodes with locations."