require 'json'
require 'csv'
require 'awesome_print'
require 'byebug'
require 'fileutils'

DATAMINE_PATH = "/home/curdy/projects/wuwa/WutheringWaves_Data"
BINDATA = "BinData"
TEXTMAPS = "Textmaps"

# textmaps_en = "#{DATAMINE_PATH}/#{TEXTMAPS}/en/multi_text/MultiText.json"
# textmaps_file = File.open(textmaps_en)

WEAPON_TYPE = {
    1 => "Broadblade",
    2 => "Sword",
    3 => "Pistols",
    4 => "Gauntlets",
    5 => "Rectifier",
}

def convert_to_png(path)
  directory = File.dirname(path)
  filename  = File.basename(path)
  filename = filename.sub(/\A(.+)\.\1\z/, '\1')

  "#{directory}/#{filename}.png"
end

def parse_iteminfo(item)
    {
        id: item["Id"],
        name: get_textmap_name(item["Name"]),
        attributes_description: get_textmap_name(item["AttributesDescription"]),
        bg_description: get_textmap_name(item["BgDescription"]),
        icon: convert_to_png(item["Icon"]),
        icon_middle: convert_to_png(item["IconMiddle"]),
        icon_small: convert_to_png(item["IconSmall"]),
        rarity: item["QualityId"],
    }
end

# convert Consume: [{Key, Value}]
# into something more appealing to the eye
# above describes a single material in a level, for example key=2, value=1000
# means shell credit cost of 1000
def convert_ascension_cost(item_database, entry)
    entry.map do |e|
        item = item_database[e["Key"]]
        {
            id: item["Id"],
            name: get_textmap_name(item["Name"]),
            value: e["Value"],
        }
    end
end

def get_textmap_name(id)
    TEXTMAP_JSON[id]&.[]("Content") || "NO CONTENT"
    # TEXTMAP_JSON.each do |textmap|
    #     if textmap["Id"] == id
    #         return textmap["Content"]
    #     end
    # end
    # return nil
end

def load_file(path, keepArray = false)
    file = File.open(path)
    json = JSON.load(file)
    # byebug
    return json if keepArray
    # byebug
    json = json.each_with_object({}) do |element, acc|
        acc[element["Id"]] = element
    end
end
TEXTMAP_JSON = load_file("#{DATAMINE_PATH}/#{TEXTMAPS}/en/multi_text/MultiText.json")

def save_json(data, path)
    FileUtils.mkdir_p("out") unless Dir.exist?("out")
    out_path = "out/#{path}"
    File.open(out_path, "w") do |f|
        f.write(JSON.pretty_generate(data))
        # f.write(data.to_json)
    end
    puts "Generated #{out_path}."
end

def save_csv(data, path)
    out_path = "out/#{path}"
    CSV.open(out_path, "w") do |csv|
        data.each do |v|
            csv << v
        end
    end
    puts "Generated #{out_path}."
end