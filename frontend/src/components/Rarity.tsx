import common from "~/assets/set-symbols/common.png";
import doubleRare from "~/assets/set-symbols/double-rare.png";
import hyperRare from "~/assets/set-symbols/hyper-rare.png";
import illustrationRare from "~/assets/set-symbols/illustration-rare.png";
import rare from "~/assets/set-symbols/rare.png";
import specialIllustrationRare from "~/assets/set-symbols/special-illustration-rare.png";
import uncommon from "~/assets/set-symbols/uncommon.png";
import ultraRare from "~/assets/set-symbols/utltra_rare.png";

/**
 * A component displaying a pokemons rarity
 */
export const Rarity: React.FC<{ rarity: string }> = (props) => {
  const { rarity } = props;

  let symbol: string | null = null;
  switch (rarity) {
    case "Common":
      symbol = common;
      break;
    case "Double Rare":
      symbol = doubleRare;
      break;
    case "Hyper Rare":
      symbol = hyperRare;
      break;
    case "Illustration Rare":
      symbol = illustrationRare;
      break;
    case "Rare":
      symbol = rare;
      break;
    case "Special Illustration Rare":
      symbol = specialIllustrationRare;
      break;
    case "Uncommon":
      symbol = uncommon;
      break;
    case "Ultra Rare":
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
