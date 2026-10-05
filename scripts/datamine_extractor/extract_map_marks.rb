require_relative 'utils'
require 'set'

@mapmarks_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/map_mark/mapmark.json", true)

data = []
@mapmarks_config.each do |row|
  data << {
    id: row["MarkId"],
    mapId: row["MapId"],
    relativeId: row["RelativeId"],
    entityConfigId: row["EntityConfigId"],
    icon: convert_to_png(row["UnlockMarkPic"]),
    title: get_textmap_name(row["MarkTitle"]),
  }
end

save_json(data, "map_marks.json")
puts "Saved #{data.size} map marks."