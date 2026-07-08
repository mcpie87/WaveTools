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

# Build lookup table: BlueprintType => { title, rewardId, rewards }
data = {}

@template_config.each do |template_config|
  blueprint = template_config["BlueprintType"]
  # next unless blueprint

  # content_key
  # next unless tid
  
  reward_id = template_config.dig("ComponentsData", "RewardComponent", "RewardId")
  next unless reward_id
  rewards = get_rewards(reward_id)
  next unless rewards && rewards.size > 0
  
  title_key = template_config.dig("ComponentsData", "BaseInfoComponent", "TidName")
  name = get_textmap_name(title_key) || "---"
  data[blueprint] = {}
  if name
    data[blueprint][:title] = name
  end
  data[blueprint][:rewardId] = reward_id
  data[blueprint][:rewards] = rewards
end

save_json(data, "blueprint_rewards.json")
