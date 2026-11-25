import React from 'react';
import Category from '@theme-original/DocSidebarItem/Category';
import { resolveIcon, ICON_STROKE } from '../../utils/iconResolver';

export default function CategoryWrapper(props) {
  const { item } = props;
  const iconName = item?.customProps?.icon;
  const Icon = resolveIcon(iconName);
  const iconClassName = 'lucide sidebarItemIcon';

  if (Icon) {
    const labelWithIcon = (
      <span className="sidebarItemWithIcon" title={item.label}>
        <Icon className={iconClassName} size={18} strokeWidth={ICON_STROKE} />
        <span>{item.label}</span>
      </span>
    );

    return <Category {...props} item={{ ...item, label: labelWithIcon }} />;
  }

  return <Category {...props} />;
}
