import pikachu from "~/assets/pikachu.png";
import eevee from "~/assets/eevee.png";
import charmander from "~/assets/charmander.png";
import pokeball from "~/assets/pokeball.png";

/**
 * Presents an avater image based on the users profile. Avatar
 * will default to a pokeball
 */
export const Avatar: React.FC<{ id: number }> = (props) => {
  const { id } = props;

  let avatar = pokeball;
  switch (id) {
    case 1:
      avatar = eevee;
      break;
    case 2:
      avatar = pikachu;
      break;
    case 3:
      avatar = charmander;
      break;
  }

  return <img src={avatar} width={100} />;
};
