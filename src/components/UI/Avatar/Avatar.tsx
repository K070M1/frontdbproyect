import Image from 'next/image';
import styles from './Avatar.module.css';

type AvatarProps = {
  src?: string;
  name: string;
  size?: number;
};

export default function Avatar({ src, name, size = 40 }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${size * 0.4}px`,
  };

  return (
    <div className={styles.avatar} style={style}>
      {src ? (
        <Image src={src} alt={name} width={size} height={size} />
      ) : (
        initials
      )}
    </div>
  );
}
