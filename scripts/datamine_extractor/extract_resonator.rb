require_relative 'utils'

weapon_types = load_file("#{DATAMINE_PATH}/#{BINDATA}/mapping/mapping.json", true)
    .select{|row| row["FieldName"] == "WeaponType"}
    .map{|e|
    {
        id: e["Value"],
        name: get_textmap_name(e["Comment"]),
        icon: convert_to_png(e["Icon"])
    }}
    .map{|e| [e[:id], e]}
    .to_h


# resonator
@roleinfo = load_file("#{DATAMINE_PATH}/#{BINDATA}/role/roleinfo.json")
# ascension
@rolebreach = load_file("#{DATAMINE_PATH}/#{BINDATA}/role_level/rolebreach.json", true)
# general item info
@iteminfo = load_file("#{DATAMINE_PATH}/#{BINDATA}/item/iteminfo.json")

# talent information
@skill_description = load_file("#{DATAMINE_PATH}/#{BINDATA}/skill/skilldescription.json")
@skill = load_file("#{DATAMINE_PATH}/#{BINDATA}/skill/skill.json", true)
@skill_level = load_file("#{DATAMINE_PATH}/#{BINDATA}/skill/skilllevel.json", true)

# contains havoc etc info
@elementinfo = load_file("#{DATAMINE_PATH}/#{BINDATA}/element_info/elementinfo.json")

def get_element(id)
    {
        id: id,
        name: get_textmap_name(@elementinfo[id]["Name"]),
        icon: convert_to_png(@elementinfo[id]["Icon4"])
    }
end

def get_ascension_mats(id)
    # rank0 is no mats
    # rank1 is only COMMON / SHELL
    # rank* is only BOSS / SPECIALTY / COMMON / SHELL
    @rolebreach
        .select{|value| id == value["BreachGroupId"]}
        .map{|row|
            {
                rank: row["BreachLevel"],
                max: row["MaxLevel"],
                materials: row["BreachConsume"].map{|mat|
                    {
                        id: mat["Key"],
                        name: get_textmap_name(@iteminfo[mat["Key"]]["Name"]),
                        value: mat["Value"],
                    }
                }
            }
        }
        .sort_by{ |row| row[:rank] }
end

def get_talents(id)
    skills = @skill.select{|row| id == row["SkillGroupId"]}

    ret = {
        normalAttack: 1,
        resonanceSkill: 2,
        resonanceLiberation: 3,
        inherentFirst: 4,
        inherentSecond: 4,
        intro: 5,
        forte: 6,
        outro: 11,
        cooking: 7
    }
    data = {}
    ret.each do |skill_type, skill_type_value|
        # select cause inherent is not 1-1 function
        skill = skills.select{|row| row["SkillType"] == skill_type_value}
        if skill.size == 1 then
            skill = skill[0]
        elsif skill.size == 2 && skill[0]["SkillName"] == skill[1]["SkillName"]
            # Rover male/female issue. Values are basically the same
            skill = skill[0]
        elsif skill.size == 4
            byebug
        elsif skill.size == 2 then
            # both inherent skills have same skill id, need to find correct value
            skill_1 = @skill_level.find{|e| e["SkillLevelGroupId"] == skill[0]["Id"]}
            skill_2 = @skill_level.find{|e| e["SkillLevelGroupId"] == skill[1]["Id"]}

            skill_levels_1 = @skill_level.find{|e| e["SkillLevelGroupId"] == skill_1["SkillLevelGroupId"]}
            skill_levels_2 = @skill_level.find{|e| e["SkillLevelGroupId"] == skill_2["SkillLevelGroupId"]}
        
            shell_cost_1 = skill_levels_1["Consume"].find{|e| e["Key"] == 2}["Value"]
            shell_cost_2 = skill_levels_2["Consume"].find{|e| e["Key"] == 2}["Value"]

            if skill_type == :inherentFirst then
                if shell_cost_1 == 10000 then
                    skill = skill[0]
                elsif shell_cost_2 == 10000 then
                    skill = skill[1]
                else
                    byebug
                end
            elsif skill_type == :inherentSecond then
                if shell_cost_1 == 20000 then
                    skill = skill[0]
                elsif shell_cost_2 == 20000 then
                    skill = skill[1]
                else
                    byebug
                end
            else
                # skill size 2 when not inherent
                byebug
            end
        end
        begin
            if skill == [] && skill_type == :cooking
                {}
            else
                skill_levels = @skill_level.select{|e| e["SkillLevelGroupId"] == skill["Id"]}
                data[skill_type] = {
                    id: skill["Id"],
                    name: get_textmap_name(skill["SkillName"]),
                    # icon: convert_to_png(skill["Icon"]),
                    # description: get_textmap_name(skill["SkillDescribe"]),
                    # resume: get_textmap_name(skill["SkillResume"]), # outline description option
                    levels: skill_levels.map.with_index { |e, i|
                        [i+1, convert_ascension_cost(@iteminfo, e["Consume"])]
                    }.to_h
                }
            end
        rescue
            byebug
        end
    end
    data
end

data = []
@roleinfo.each do |role_id, role_value|
    unless role_value["RoleType"] == 1
        next
    end

    # each group is sorted BOSS / SPECIALTY / COMMON / SHELL
    # except for rank2, which is only COMMON / SHELL
    ascension_mats = get_ascension_mats(role_value["BreachId"])

    new_row = {
        id: role_value["Id"],
        rarity: role_value["QualityId"],
        name: get_textmap_name(role_value["Name"]),
        weaponType: weapon_types[role_value["WeaponType"]],
        element: get_element(role_value["ElementId"]),
        card: convert_to_png(role_value["Card"]),
        body: role_value["RoleBody"],
        icon: {
            circle: convert_to_png(role_value["RoleHeadIconCircle"]),
            large: convert_to_png(role_value["RoleHeadIconLarge"]),
            big: convert_to_png(role_value["RoleHeadIconBig"]),
        },
        ascensionMaterials: ascension_mats,
        talents: get_talents(role_value["SkillTreeGroupId"]),
    }
    data << new_row
    puts("#{new_row[:id]}  #{new_row[:rarity]} #{new_row[:name]}")
end

save_json(data, "resonator.json")