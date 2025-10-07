import { RadioGroup } from '@headlessui/react';
import { classNames, priceWithSign } from '@/utils/helper';
import Title6 from '@/components/shared/typo/Title6';
import { ProductSize, ProductSizeOption } from '@/types';

type Props = {
  sizes: ProductSizeOption[];
  selectedSize?: ProductSize;
  onChange: (size: ProductSize) => void;
};

export default function ProductSizeSwitch({ sizes, selectedSize, onChange }: Props) {

  return (
    <div>
      {/* Tiêu đề */}
      <Title6 className="mb-2">Kích cỡ</Title6>

      <RadioGroup value={selectedSize} onChange={onChange}>
        <RadioGroup.Label className="sr-only">
          Kích cỡ cà phê
        </RadioGroup.Label>

        <div className="flex flex-row gap-4">
          {sizes.map((option) => (
            <RadioGroup.Option
              key={option.size}
              value={option.size}
              className={({ checked }) =>
                classNames(
                  'flex items-center justify-center px-4 py-1 border rounded-xl',
                  checked
                    ? 'bg-primary-50 border-primary-600'
                    : 'bg-white border-neutral-200'
                )
              }
            >
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold">{option.size}</span>
                <span className="text-xs text-neutral-500">{priceWithSign(option.price)}</span>
              </div>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
