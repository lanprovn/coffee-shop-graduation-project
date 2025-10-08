import Title2 from '@/components/shared/typo/Title2';

interface DocTitle2Props {
  children: string;
}

export default function DocTitle2({ children }: DocTitle2Props) {
  return <Title2 className="text-primary mt-8 mb-2">{children}</Title2>;
}
