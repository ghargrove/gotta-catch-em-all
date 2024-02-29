import bulbasaur from "~/assets/bulbasaur.png";
import charmander from "~/assets/charmander.png";
import eevee from "~/assets/eevee2.png";
import pikachu from "~/assets/pikachu2.png";
import pokeball from "~/assets/pokeball.png";

type AvatarProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  avatarId: number;
};

/**
 * Presents an avater image based on the users profile. Avatar
 * will default to a pokeball
 */
export const Avatar: React.FC<AvatarProps> = (props) => {
  const { avatarId, width = 100, ...rest } = props;

  let avatar = pokeball;
  switch (avatarId) {
    case 1:
      avatar = eevee;
      break;
    case 2:
      avatar = pikachu;
      break;
    case 3:
      avatar = bulbasaur;
      break;
    case 4:
      avatar = charmander;
      break;
  }

  return <img src={avatar} width={width} {...rest} />;
};
