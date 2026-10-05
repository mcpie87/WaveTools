require_relative 'utils'
require 'set'

@levelentity_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/level_entity/levelentityconfig.json", true)
@template_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/template/templateconfig.json", true)
@blueprint_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/blueprint/blueprintconfig.json", true)

blueprint_types    = @blueprint_config.map { |e| e["BlueprintType"] }.to_set
template_types     = @template_config.map { |e| e["BlueprintType"] }.to_set
levelentity_types  = @levelentity_config.map { |e| e["BlueprintType"] }.to_set

matchmaking_types = blueprint_types | template_types
missing = levelentity_types - matchmaking_types

# Build lookup table: BlueprintType => TidName
template_tid_by_blueprint = {}

@template_config.each do |tpl|
  blueprint = tpl["BlueprintType"]
  next unless blueprint

  tid = tpl.dig("ComponentsData", "BaseInfoComponent", "TidName")
  next unless tid

  name = get_textmap_name(tid)
  template_tid_by_blueprint[blueprint] =
    name.nil? || name.empty? ? "---" : name
end

# Translate levelentity BlueprintTypes to TidNames
translated = []
missing = []

@levelentity_config.each do |le|
  blueprint = le["BlueprintType"]
  next unless blueprint

  tid = template_tid_by_blueprint[blueprint]

  if tid
    translated << {
      "LevelEntityId" => le["Id"],
      "BlueprintType" => blueprint,
      "TidName" => tid
    }
  else
    missing << {
      "LevelEntityId" => le["Id"],
      "BlueprintType" => blueprint
    }
  end
end

save_json(template_tid_by_blueprint, "blueprint_translations.json")

byebug


print "hi"
# data = []
# @synthesisformula.each do |row|
#   item = @iteminfo[row["ItemId"]]
#   puts "#{row["Id"]} #{get_textmap_name(item["Name"])}"
#   new_row = {
#     type: "synthesis",
#     id: row["Id"],
#     resultItem: parse_iteminfo(item),
#     name: get_textmap_name(item["Name"]),
#     rarity: item["QualityId"],
#     materials: row["ConsumeItems"].map{|e| {
#       id: e["ItemId"],
#       name:get_textmap_name(@iteminfo[e["ItemId"]]["Name"]),
#       value: e["Count"]
#     }},
#     formulaType: row["FormulaType"],
#   }
#   data << new_row
# end
# save_json(data, "synthesis.json")

# data = []
# @cookprocessedformula.each do |row|
#   item = @iteminfo[row["FinalItemId"]]
#   puts "#{row["Id"]} #{get_textmap_name(item["Name"])}"
#   new_row = {
#     type: "processed",
#     id: row["Id"],
#     resultItem: parse_iteminfo(item),
#     materials: row["ConsumeItemsId"].map{|e| {
#       id: e["ItemId"],
#       name:get_textmap_name(@iteminfo[e["ItemId"]]["Name"]),
#       value: e["Count"]
#     }},
#   }
#   data << new_row
# end
# save_json(data, "cookprocessed.json")

# data = []
# @cookingformula.each do |row|
#   item = @iteminfo[row["FoodItemId"]]
#   specialty_row = @specialcookformula.find{|e| e["FormulaId"] == row["Id"]}
#   puts "#{row["Id"]} #{get_textmap_name(item["Name"])}"
#   new_row = {
#     type: "dish",
#     id: row["Id"],
#     resultItem: parse_iteminfo(item),
#     materials: row["ConsumeItems"].map{|e| {
#       id: e["ItemId"],
#       name:get_textmap_name(@iteminfo[e["ItemId"]]["Name"]),
#       value: e["Count"]
#     }},
#     typeId: row["TypeId"],
#   }
#   unless specialty_row.nil?
#     specialty_item = specialty_row ? @iteminfo[specialty_row["ItemId"]] : nil
#     specialty_resonator = @roleinfo[specialty_row["RoleId"]]
#     new_row[:specialtyItem] = parse_iteminfo(specialty_item)
#     new_row[:specialtyCook] = {
#       id: specialty_resonator["Id"],
#       name: get_textmap_name(specialty_resonator["Name"]),
#       icon: convert_to_png(specialty_resonator["Card"]),
#       rarity: specialty_resonator["QualityId"],
#     }
#   end
#   data << new_row
# end
# save_json(data, "cooking.json")

# data = []
# @shops.each do |row|
#   puts "#{row["Id"]} #{get_textmap_name(row["ShopName"])}"
#   shop_items = @shopitems.select{|e| e["ShopId"] == row["Id"]}
#   begin
#   new_row = {
#     id: row["Id"],
#     type: row["ShowType"],
#     name: get_textmap_name(row["ShopName"]),
#     currency: row["ShowCurrency"],
#     openId: row["OpenId"],
#     dialogue: row["DialogueType"],
#     items: shop_items.map{|e|
#       # puts e
#       {
#       id: e["ItemId"],
#       name: get_textmap_name(@iteminfo[e["ItemId"]]&.[]("Name")) || "NO ITEM", # get_textmap_name(@iteminfo[e["ItemId"]]["Name"]),
#       value: e["Price"].map{|curr|
#         {
#           id: curr["Key"],
#           name: get_textmap_name(@iteminfo[curr["Key"]]["Name"]),
#           value: curr["Value"],
#         }
#       },
#     }}
#   }
# rescue
#   byebug
# end
#   data << new_row
# end
# save_json(data, "shops.json")


# buyable_items = {}
# @shopitems.each do |row|
#   unless buyable_items[row["ItemId"]]
#     buyable_items[row["ItemId"]] = []
#   end
#   buyable_items[row["ItemId"]] << row
# end
# data = []
# buyable_items.each do |item_id, rows|
#   item = @iteminfo[item_id]
#   new_row = {
#     id: item_id,
#     itemName: item ? get_textmap_name(item["Name"]) : "NO ITEM",
#     shops: rows.map{|row|
#       shop = @shops.find {|shop| shop["Id"] == row["ShopId"]}
#       # get_textmap_name(shop["ShopName"]) || "NO SHOP NAME"
#       {
#         id: row["ShopId"],
#         shopName: get_textmap_name(shop["ShopName"]),
#         price: row["Price"].map{|e| "#{get_textmap_name(@iteminfo[e["Key"]]["Name"])} - #{e["Value"]}"},
#         limit: row["LimitNum"],
#       }
#     },
#   }
#   data << new_row
# end
# save_json(data, "buyable_items.json")
# puts "hey"