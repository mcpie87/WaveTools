require 'fileutils'
require 'json'
require 'csv'
require 'byebug'
require 'pp'

datamine_path = "/mnt/c/Users/pkmac/projects/wuwa/WutheringWaves_Data"
bindata = "BinData"
textmaps = "Textmaps"

iteminfo = "#{datamine_path}/#{bindata}/item/iteminfo.json"
iteminfo_file = File.open(iteminfo)
iteminfo_file_json = JSON.load(iteminfo_file)

textmaps_en = "#{datamine_path}/#{textmaps}/en/multi_text/MultiText.json"
textmaps_file = File.open(textmaps_en)
@textmaps_file_json = JSON.load(textmaps_file)

def get_textmap_name(id)
    @textmaps_file_json.each do |textmap|
        if textmap["Id"] == id
            return textmap["Content"]
        end
    end
    return nil
end


data = []
iteminfo_file_json.each do |row|
    new_row = {
        id: row["Id"],
        name: get_textmap_name(row["Name"]),
        attributes_description: row["AttributesDescription"],
        bg_description: row["BgDescription"],
        icon: row["Icon"],
        icon_middle: row["IconMiddle"],
        icon_small: row["IconSmall"],
        rarity: row["QualityId"],
    }
    data << new_row unless new_row[:name].nil?
    puts("#{new_row[:id]}  #{new_row[:rarity]} #{new_row[:name]}")
end

FileUtils.mkdir_p("out") unless Dir.exist?("out")
out_path = "out/items.json"
File.open(out_path, "w") do |f|
    f.write(JSON.pretty_generate(data))
end

puts "Generated #{out_path}."