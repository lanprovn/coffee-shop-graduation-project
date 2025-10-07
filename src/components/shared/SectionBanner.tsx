import React from 'react';

type SectionBannerProps = {
    title: string;
    subtitle?: string;
    emoji?: string;
    gradientFrom?: string;
    gradientTo?: string;
};

/**
 * SectionBanner: Banner chia nhóm sản phẩm với nền gradient và icon emoji
 * Dùng để đặt trước các section như Popular, Hot, Cold...
 */
export default function SectionBanner({
    title,
    subtitle,
    emoji = '☕',
    gradientFrom = 'from-amber-100',
    gradientTo = 'to-orange-100',
}: SectionBannerProps) {
    return (
        <div className={`w-full rounded-2xl p-4 mb-3 bg-gradient-to-r ${gradientFrom} ${gradientTo} border border-primary/10 shadow-sm`}>
            <div className="flex items-center gap-3">
                <div className="text-2xl select-none">{emoji}</div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    {subtitle && (
                        <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
        </div>
    );
}


