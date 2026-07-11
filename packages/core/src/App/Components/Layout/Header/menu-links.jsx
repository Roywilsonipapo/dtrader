import { Text } from '@deriv/components';
import { LegacyReportsIcon } from '@deriv/quill-icons';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTranslations } from '@deriv-com/translations';
import { BinaryLink } from '../../Routes';
import './menu-links.scss';
const MenuItems = ({ id, text, icon, link_to }) => {
    return (
        <BinaryLink
            id={id}
            key={icon}
            to={link_to}
            className='header__menu-link'
            active_class='header__menu-link--active'
        >
            <Text size='m' line_height='xs' title={text} className='header__menu-link-text'>
                {icon}
                {text}
            </Text>
        </BinaryLink>
    );
};
const ReportTab = () => {
    const { localize } = useTranslations();
    return (
        <MenuItems
            id={'dt_reports_tab'}
            icon={<LegacyReportsIcon className='header__icon' iconSize='xs' fill='var(--color-text-primary)' />}
            text={localize('Reports')}
            link_to={routes.reports}
        />
    );
};
const BotBuilderTab = () => {
    const { localize } = useTranslations();
    return (
        <MenuItems
            id={'dt_bot_builder_tab'}
            icon={<span className='header__icon' style={{ marginRight: 6 }}>🤖</span>}
            text={localize('Bot Builder')}
            link_to={routes.bot_builder}
        />
    );
};
const MenuLinks = observer(({ is_traders_hub_routes = false }) => {
    const { currentLang } = useTranslations();
    const { client } = useStore();
    const { is_logged_in } = client;
    if (!is_logged_in) return <></>;
    return (
        <div key={`menu-links__${currentLang}`} className='header__menu-links'>
            {!is_traders_hub_routes && <ReportTab />}
            {!is_traders_hub_routes && <BotBuilderTab />}
        </div>
    );
});
export default MenuLinks;