require_relative 'utils'
require 'set'

@questdata_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/QuestData/questdata.json", true)

data = []
@questdata_config.each do |row|
  rowData = row["Data"]
  data << {
    QuestId: row["QuestId"],
    Id: rowData["Id"],
    Type: rowData["Type"],
    RegionId: rowData["RegionId"],
    RoleId: rowData["RoleId"],
    Key: rowData["Key"],
    TidName: get_textmap_name(rowData["TidName"]),
    TidDesc: get_textmap_name(rowData["TidDesc"]),
    RewardId: rowData["RewardId"],
    ProvideType: rowData["ProvideType"],
    DistributeType: rowData["DistributeType"],
    Reference: rowData["Reference"],
    Children: rowData["Children"],
    WeakReference: rowData["WeakReference"],
    ActiveActions: rowData["ActiveActions"],
    AddInteractOption: rowData["AddInteractOption"],
  }
end

save_json(data, "questdata.json")
puts "Saved #{data.size} quest."