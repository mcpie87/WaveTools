require_relative 'utils'
require 'set'
require 'byebug'

@questchapter_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/quest_chapter/questchapter.json")
@questmaintype_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/questtype/questmaintype.json")
@questdata_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/QuestData/questdata.json", false, "QuestId")
@levelplaydata_config = load_file("#{DATAMINE_PATH}/#{BINDATA}/LevelPlayData/levelplaydata.json", false, "LevelPlayId")

# data = []
# @questchapter_config.each do |row|
#   data << {
#     Id: row["Id"],
#     ChapterNum: get_textmap_name(row["ChapterNum"]),
#     SectionNum: get_textmap_name(row["SectionNum"]),
#     ActName: get_textmap_name(row["ActName"]),
#     ChapterName: get_textmap_name(row["ChapterName"]),
#     ChapterIcon: convert_to_png(row["ChapterIcon"]),
#     PrefabName: row["PrefabName"],
#   }
# end
# save_json(data, "questchapter.json")
# puts "Saved #{data.size} questchapter."

def get_tracked_entity_id(row)
  tracked_id = (row["Reference"] || row.dig("Data", "Reference"))
  return nil if tracked_id.nil?

  type, map, id = tracked_id[0].split("_")
  # it can be e_MAP_ID, l_ID, q_ID
  id = map if id.nil?
  id = id.to_i
  if type == "e"
    "#{type}_#{map}_#{id}"
  elsif type == "l"
    lpdata = @levelplaydata_config[id]
    byebug unless lpdata.is_a?(Hash)
    get_tracked_entity_id(lpdata)
  elsif type == "q"
    qdata = @questdata_config[id]
    byebug unless qdata.is_a?(Hash)
    get_tracked_entity_id(qdata)
  elsif type == "f"
    # TODO find out what is it
    nil
  elsif type.nil?
    nil
  else
    byebug
  end
end

def extract_quest_data(row)
  {
    id: row["Id"],
    mapId: row["DungeonId"],
    questTypeId: row["Type"],
    chapterId: row["ChapterId"],
    # mapId: row["RegionId"],
    # Key: row["Key"],
    name: get_textmap_name(row["TidName"]),
    description: get_textmap_name(row["TidDesc"]),
    # RewardId: row["RewardId"],
    # OnlineType: row["OnlineType"],
    # IsAutoTrack: row["IsAutoTrack"],
    # ProvideType: row["ProvideType"],
    # DistributeType: row["DistributeType"],
    # ObjType: row["ObjType"],
    # trackEntityId: row.dig("AddInteractOption", "EntityId"),
    trackEntityId: get_tracked_entity_id(row),
    children: row["Children"],
    references: row["Reference"],
  }
end

quest_types = {}
quest_chapters = {}
trackable_quests = 0
untrackable_quests = 0
data = []
@questdata_config.entries.each do |id, row|
  rowData = row["Data"]
  skip_row = rowData && rowData["Reference"]
  next unless skip_row

  quest_data = extract_quest_data(rowData)
  if !rowData["Reference"]
    untrackable_quests += 1
    next
  end
  first_reference_entity_id = rowData["Reference"][0].split("_")[2].to_i
  # # 2026-05-11 - removed this completely, this fails for "Graduation Trip"
  # # where first 2 references are same entity id but different map id
  # if !rowData["AddInteractOption"]
  #   # puts "No AddInteractOption for #{rowData["Id"]}"
  #   untrackable_quests += 1
  # else
  #   tracked_entity_id = rowData["AddInteractOption"]["EntityId"]
  #   byebug if tracked_entity_id != first_reference_entity_id
  # end
  trackable_quests += 1
  next if quest_data[:name].nil? || quest_data[:description] == ""
  type_name = get_textmap_name(@questmaintype_config.dig(rowData["Type"], "MainTypeName")) || "EMPTY"
  chapter_name = get_textmap_name(@questchapter_config.dig(rowData["ChapterId"], "ChapterName")) || "EMPTY"
  quest_data[:typeName] = type_name
  quest_data[:chapterName] = chapter_name
  # type_id = "#{rowData["Type"]}-#{type_name}"
  # chapter_id = "#{rowData["ChapterId"]}-#{chapter_name}"
  
  # quest_types[type_id] ||= {}
  # quest_types[type_id][chapter_id] ||= []
  # quest_types[type_id][chapter_id] << quest_data

  data << quest_data
end
save_json(data, "quest_types.json")
puts "Saved #{data.size} quest types."
puts trackable_quests
puts untrackable_quests

# byebug
# puts "asdf"

# def get_quest_chapter(id)
#   row = @questchapter_config.find { |row| row["Id"] == id }
#   {
#     Id: row["Id"],
#     ChapterNum: get_textmap_name(row["ChapterNum"]),
#     SectionNum: get_textmap_name(row["SectionNum"]),
#     ActName: get_textmap_name(row["ActName"]),
#     ChapterName: get_textmap_name(row["ChapterName"]),
#     ChapterIcon: convert_to_png(row["ChapterIcon"]),
#     PrefabName: row["PrefabName"],
#   }
# end

# data = []
# @questmaintype_config.each do |row|
#   quest_chapters = @questchapter_config.select { |chapter_row| chapter_row["Id"] == row["ChapterId"] }

#   data << {
#     Id: row["Id"],
#     MainTypeName: get_textmap_name(row["MainTypeName"]),
#     QuestTabIcon: convert_to_png(row["QuestTabIcon"]),
#     QuestTypeTitleIcon: convert_to_png(row["QuestTypeTitleIcon"]),
#     QuestChapterBg: convert_to_png(row["QuestChapterBg"]),
#     TrackIconId: row["TrackIconId"],
#     TypeColor: row["TypeColor"],
#     SortValue: row["SortValue"],
#     AutoHideTrack: row["AutoHideTrack"],
#     NewQuestTipTime: row["NewQuestTipTime"],
#     QuestUpdateTipsTime: row["QuestUpdateTipsTime"],
#     QuestChapters: 
#   }
# end
# save_json(data, "questmaintype.json")
# puts "Saved #{data.size} questmaintype."