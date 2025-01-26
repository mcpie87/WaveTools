require_relative 'utils'

weapon_types = load_file("#{DATAMINE_PATH}/#{BINDATA}/mapping/mapping.json", true)
    .select{|row| row["FieldName"] == "WeaponType"}
    .map{|e|
        byebug    
    {
        id: e["Value"],
        name: get_textmap_name(e["Comment"]),
        icon: convert_to_png(e["Icon"])
    }}
    .map{|e| [e[:id], e]}
    .to_h


# resonator
roleinfo = load_file("#{DATAMINE_PATH}/#{BINDATA}/role/roleinfo.json")
# ascension
rolebreach = load_file("#{DATAMINE_PATH}/#{BINDATA}/role_level/rolebreach.json", true)
# general item info
iteminfo = load_file("#{DATAMINE_PATH}/#{BINDATA}/item/iteminfo.json")

# contains havoc etc info
elementinfo = load_file("#{DATAMINE_PATH}/#{BINDATA}/element_info/elementinfo.json")

data = []
roleinfo.each do |role_id, role_value|
    unless role_value["RoleType"] == 1
        next
    end

    # each group is sorted BOSS / SPECIALTY / COMMON / SHELL
    # except for rank2, which is only COMMON / SHELL
    ascension_mats = rolebreach
        .select{|value| value["BreachGroupId"] == role_value["BreachId"]}
        .map{|row|
            {
                rank: row["BreachLevel"],
                max: row["MaxLevel"],
                materials: row["BreachConsume"].map{|mat|
                    {
                        id: mat["Key"],
                        name: get_textmap_name(iteminfo[mat["Key"]]["Name"]),
                        value: mat["Value"],
                    }
                }
            }
        }
        .sort_by{ |row| row[:rank] }

    new_row = {
        id: role_value["Id"],
        rarity: role_value["QualityId"],
        name: get_textmap_name(role_value["Name"]),
        weaponType: weapon_types[role_value["WeaponType"]],
        element: {
            id: role_value["ElementId"],
            name: get_textmap_name(elementinfo[role_value["ElementId"]]["Name"]),
            icon: convert_to_png(elementinfo[role_value["ElementId"]]["Icon4"])
        },
        card: convert_to_png(role_value["Card"]),
        body: role_value["RoleBody"],
        icon: {
            circle: convert_to_png(role_value["RoleHeadIconCircle"]),
            large: convert_to_png(role_value["RoleHeadIconLarge"]),
            big: convert_to_png(role_value["RoleHeadIconBig"]),
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
            normalAttack: "",
            resonanceSkill: "",
            forte: "",
            resonanceLiberation: "",
            intro: "",
            outro: "",
        }
    }
    data << new_row
    puts("#{new_row[:id]}  #{new_row[:rarity]} #{new_row[:name]}")
end

save_json(data, "resonator.json")