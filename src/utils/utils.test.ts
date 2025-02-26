import { convertToUrl } from "./utils";

const ASSET_URL = "https://raw.githubusercontent.com/alt3ri/WW_Asset/refs/heads/Global/";

describe('utils test', () => {
  test('icon url should return correct url', () => {
    const urls = [
      "  /Game/Aki/UI/UIResources/Common/Image/IconWup160/T_IconWup160_02_UI.png",
      "/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconNor/SP_IconNorKnife.png",
      "/Game/Aki/UI/UIResources/Common/Image/IconWeapon160/T_IconWeapon160_21030015_UI.png",
      "/Game/Aki/UI/UIResources/Common/Image/IconRoleHeadCircle256/T_IconRoleHeadCircle256_8_UI.png",
      "  /Game/Aki/UI/UIResources/Common/Image/IconRoleHead256/T_IconRoleHead256_7.png  "
    ];

    expect(convertToUrl(urls[0])).toBe(ASSET_URL + "UIResources/Common/Image/IconWup160/T_IconWup160_02_UI.png");
    expect(convertToUrl(urls[1])).toBe(ASSET_URL + "UIResources/Common/Atlas/SkillIcon/SkillIconNor/SP_IconNorKnife.png");
    expect(convertToUrl(urls[2])).toBe(ASSET_URL + "UIResources/Common/Image/IconWeapon160/T_IconWeapon160_21030015_UI.png");
    expect(convertToUrl(urls[3])).toBe(ASSET_URL + "UIResources/Common/Image/IconRoleHeadCircle256/T_IconRoleHeadCircle256_8_UI.png");
    expect(convertToUrl(urls[4])).toBe(ASSET_URL + "UIResources/Common/Image/IconRoleHead256/T_IconRoleHead256_7.png");
  });
});