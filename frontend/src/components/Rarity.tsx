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

  let symbol = common;
  switch (rarity) {
    case "Uncommon":
      symbol = uncommon;
      break;
    case "Rare":
      symbol = rare;
      break;
    case "Double Rare":
      symbol = doubleRare;
      break;
    case "Ultra Rare":
      symbol = ultraRare;
      break;
    case "Illustration Rare":
      symbol = illustrationRare;
      break;
    case "Special Illustration Rare":
      symbol = specialIllustrationRare;
      break;
    case "Hyper Rare":
      symbol = hyperRare;
      break;
  }

  return (
    <div className="flex">
      <p className="pr-1">{rarity}</p>
      <img src={symbol} height={24} width={24} />
    </div>
  );
};
