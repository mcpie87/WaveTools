require 'fileutils'
require 'json'
require 'csv'
require 'byebug'
require 'pp'
require 'awesome_print'

datamine_path = "/mnt/c/Users/pkmac/projects/wuwa/WutheringWaves_Data"
bindata = "BinData"
textmaps = "Textmaps"

roleinfo = "#{datamine_path}/#{bindata}/role/roleinfo.json"
textmaps_en = "#{datamine_path}/#{textmaps}/en/multi_text/MultiText.json"

roleinfo_file = File.open(roleinfo)
roleinfo_file_json = JSON.load(roleinfo_file)
textmaps_file = File.open(textmaps_en)
@textmaps_file_json = JSON.load(textmaps_file)

#ascension mats
rolebreach = "#{datamine_path}/#{bindata}/role_level/rolebreach.json"
rolebreach_file = File.open(rolebreach)
rolebreach_file_json = JSON.load(rolebreach_file)

# iteminfo
iteminfo = "#{datamine_path}/#{bindata}/item/iteminfo.json"
iteminfo_file = File.open(iteminfo)
iteminfo_file_json = JSON.load(iteminfo_file)

def get_textmap_name(id)
    @textmaps_file_json.each do |textmap|
        if textmap["Id"] == id
            return textmap["Content"]
        end
    end
    nil
end

data = []
roleinfo_file_json.each do |roleinfo_single|
    unless roleinfo_single["RoleType"] == 1
        next
    end

    # each group is sorted BOSS / SPECIALTY / COMMON / SHELL
    # except for rank2, which is only COMMON / SHELL
    ascension_mats = rolebreach_file_json
        .select{|row| row["BreachGroupId"] == roleinfo_single["BreachId"]}
        .map{|row|
            {
                rank: row["BreachLevel"],
                max: row["MaxLevel"],
                materials: row["BreachConsume"].map{|mat|
                    {
                        id: mat["Key"],
                        name: get_textmap_name( iteminfo_file_json.find{|e| e["Id"] == mat["Key"]}["Name"] ),
                        value: mat["Value"],
                    }
                }
            }
        }
        .sort_by{ |row| row[:max] }

    new_row = {
        id: roleinfo_single["Id"],
        rarity: roleinfo_single["QualityId"],
        name: get_textmap_name(roleinfo_single["Name"]),
        elementId: roleinfo_single["ElementId"],
        card: roleinfo_single["Card"],
        weapon: roleinfo_single["WeaponType"],
        body: roleinfo_single["RoleBody"],
        icon: {
            circle: roleinfo_single["RoleHeadIconCircle"],
            large: roleinfo_single["RoleHeadIconLarge"],
            big: roleinfo_single["RoleHeadIconBig"],
        },
        materials: ascension_mats,
        # materials: {
        #     weekly: "",
        #     boss: "",
        #     specialty: "",
        #     common: "",
        #     talent: "",
        # },
        talents: {
            normal_attack: "",
            resonance_skill: "",
            forte: "",
            resonance_liberation: "",
            intro: "",
            outro: "",
        }
    }
    data << new_row
    # puts("#{new_row[:id]}  #{new_row[:rarity]} #{new_row[:name]}")
end

FileUtils.mkdir_p("out") unless Dir.exist?("out")
out_path = "out/resonator.json"
File.open(out_path, "w") do |f|
    f.write(JSON.pretty_generate(data))
end

puts "Generated #{out_path}."