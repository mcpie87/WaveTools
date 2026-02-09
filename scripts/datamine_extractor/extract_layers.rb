require_relative 'utils'
require 'set'

@area_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/area/area.json", true)
@multimap_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/map/multimap.json", true)
@uiresource_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/ui_resource/uiresource.json")

data = []
@multimap_config.each do |row|
  if row["Area"].size === 0
    next
  elsif row["Area"].size > 1
    byebug
    next
  end

  mapId = row["MapId"]
  areaId = row["Area"][0]
  mapTiles = {}
  row["MapTilePath"].each do |tile|
    mapTiles[tile] = convert_to_png(@uiresource_config[tile]["Path"])
  end

  data << {
    mapId: mapId,
    areaId: areaId,
    mapTiles: mapTiles,
  }
end

save_json(data, "map_tiles.json")
puts "Saved #{data.size} map tiles."