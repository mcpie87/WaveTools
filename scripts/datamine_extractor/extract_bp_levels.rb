require_relative 'utils'

@iteminfo_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/item/iteminfo.json", false, "Id")
@bp_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/battle_pass/battlepassreward.json", true)

data = []

def extract_item(item)
  {
    id: item["Id"],
    name: get_textmap_name(item["Name"]),
    attributes_description: get_textmap_name(item["AttributesDescription"]),
    bg_description: get_textmap_name(item["BgDescription"]),
    icon: convert_to_webp(item["Icon"]),
    icon_middle: convert_to_webp(item["IconMiddle"]),
    icon_small: convert_to_webp(item["IconSmall"]),
    rarity: item["QualityId"],
  }
end

data = {}
@bp_config.each do |row|
  battle_pass_id = row["BattlePassId"]
  data[battle_pass_id] ||= []
  data[battle_pass_id]
  byebug unless row["FreeReward"].size == 1
  byebug unless [1,2].include?(row["PayReward"].size)
  begin
  data[battle_pass_id] << {
    level: row["Level"],
    free: row["FreeReward"].map {|item| {
      item: extract_item(@iteminfo_config[item["Key"]]),
      amount: item["Value"]
    }},
    paid: row["PayReward"].map {|item| {
      item: extract_item(@iteminfo_config[item["Key"]]),
      amount: item["Value"]
    }},
  }
rescue
  byebug
end

end  

save_json(data, "bp_rewards.json")

# # save as csv
csv_data = []
data.each do |row|
  # begin
  row[1].each do |bp_level_rewards|
    new_row = []
    new_row << row[0] # BP version
    new_row << bp_level_rewards[:level] # BP level
    # BP free - always 1 item
    byebug unless bp_level_rewards[:free].size == 1
    new_row << bp_level_rewards[:free][0][:item][:id]
    new_row << bp_level_rewards[:free][0][:item][:name]
    new_row << bp_level_rewards[:free][0][:item][:icon]
    new_row << bp_level_rewards[:free][0][:amount]

    # Paid, either 1 or 2 items
    new_row << bp_level_rewards[:paid][0][:item][:id]
    new_row << bp_level_rewards[:paid][0][:item][:name]
    new_row << bp_level_rewards[:paid][0][:item][:icon]
    new_row << bp_level_rewards[:paid][0][:amount]

    if bp_level_rewards[:paid].size == 1
      new_row << nil
      new_row << nil
      new_row << nil
      new_row << nil
    else
      new_row << bp_level_rewards[:paid][1][:item][:id]
      new_row << bp_level_rewards[:paid][1][:item][:name]
      new_row << bp_level_rewards[:paid][1][:item][:icon]
      new_row << bp_level_rewards[:paid][1][:amount]
    end
    csv_data << new_row
  end
end

save_csv(csv_data, "bp_rewards.csv")