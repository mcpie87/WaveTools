require_relative 'utils'
require 'set'

@area_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/area/area.json", true)
@multimap_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/map/multimap.json", true)
@uiresource_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/ui_resource/uiresource.json")

data = []
@multimap_config.each do |row|
  if row["Area"].size === 0
    next
  end

  mapId = row["MapId"]
  areaIds = row["Area"]
  mapTiles = {}
  row["MapTilePath"].each do |tile|
    mapTiles[tile] = convert_to_png(@uiresource_config[tile]["Path"])
  end

  data << {
    floorName: get_textmap_name(row["FloorName"]),
    floorIcon: row["FloorIcon"],
    floor: row["Floor"],
    mapId: mapId,
    areaId: areaIds[0], # TODO: 3.5 added arrayable areaIds, need to fix it
    areaIds: areaIds,
    mapTiles: mapTiles,
  }
end

save_json(data, "map_tiles.json")
puts "Saved #{data.size} map tiles."