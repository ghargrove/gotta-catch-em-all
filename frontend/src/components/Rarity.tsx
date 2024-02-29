import common from "~/assets/set-symbols/common.png";
import doubleRare from "~/assets/set-symbols/double-rare.png";
import hyperRare from "~/assets/set-symbols/hyper-rare.png";
import illustrationRare from "~/assets/set-symbols/illustration-rare.png";
import rare from "~/assets/set-symbols/rare.png";
import specialIllustrationRare from "~/assets/set-symbols/special-illustration-rare.png";
import uncommon from "~/assets/set-symbols/uncommon.png";
import ultraRare from "~/assets/set-symbols/utltra_rare.png";

/** Available rarity types */
export enum RarityType {
  Common = "Common",
  DoubleRare = "Double Rare",
  HyperRare = 'Hyper Rare',
  IllustrationRare = 'Illustration Rare',
  Rare = 'Rare',
  SpecialIllustrationRare = 'Special Illustration Rare',
  Uncommon = 'Uncommon',
  UltraRare = 'Ultra Rare'
}

/**
 * A component displaying a pokemons rarity
 */
export const Rarity: React.FC<{ rarity: RarityType }> = (props) => {
  const { rarity } = props;

  let symbol: string | null = null;
  switch (rarity) {
    case RarityType.Common:
      symbol = common;
      break;
    case RarityType.DoubleRare:
      symbol = doubleRare;
      break;
    case RarityType.HyperRare:
      symbol = hyperRare;
      break;
    case RarityType.IllustrationRare:
      symbol = illustrationRare;
      break;
    case RarityType.Rare:
      symbol = rare;
      break;
    case RarityType.SpecialIllustrationRare:
      symbol = specialIllustrationRare;
      break;
    case RarityType.Uncommon:
      symbol = uncommon;
      break;
    case RarityType.UltraRare:
      symbol = ultraRare;
      break;
  }

  return (
    <div className="flex">
      <p className="pr-1">{rarity}</p>
      {symbol !== null && <img src={symbol} height={24} width={24} />}
    </div>
  );
};
