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

save_json(template_tid_by_blueprint, "blueprints.json")
