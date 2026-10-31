import React from 'react';
import Link from '@theme-original/DocSidebarItem/Link';
import { resolveIcon, ICON_STROKE } from '../../utils/iconResolver';

export default function LinkWrapper(props) {
  const { item } = props;
  const { customProps } = item;
  
  const iconName = customProps?.icon;
  const Icon = resolveIcon(iconName);
  const iconClassName = 'lucide sidebarItemIcon';

  if (Icon) {
    const LabelWithIcon = (
      <span className="sidebarItemWithIcon" title={item.label}>
        <Icon className={iconClassName} size={18} strokeWidth={ICON_STROKE} />
        <span>{item.label}</span>
      </span>
    );

    const newItem = {
      ...item,
      label: LabelWithIcon,
    };

    return <Link {...props} item={newItem} />;
  }

  return <Link {...props} />;
}
