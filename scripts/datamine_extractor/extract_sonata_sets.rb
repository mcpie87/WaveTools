require_relative 'utils'

sonata_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/phantom/phantomfettergroup.json")

data = []
sonata_config.each do |entry|
    row = entry[1]
    new_row = {
        id: row["Id"],
        name: get_textmap_name(row["FetterGroupName"]),
        sortId: row["SortId"],
        icon: convert_to_png(row["FetterElementPath"]),
    }
    data << new_row unless new_row[:name].nil?
    # puts("#{new_row[:id]}  #{new_row[:rarity]} #{new_row[:name]}")
end

save_json(data, "sonatas.json")