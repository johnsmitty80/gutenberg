/**
 * WordPress dependencies
 */
import {
	Button,
	__experimentalNavigationItem as NavigationItem,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TemplatePreview from './template-preview';
import { NavigationPanelPreviewFill } from '.';
import { getTemplateInfo } from '../../../utils';

export default function TemplateNavigationItems( {
	entityType = 'wp_template',
	templates,
	onActivateItem,
} ) {
	const defaultTemplateTypes = useSelect( ( select ) => {
		const { getSettings } = select( 'core/edit-site' );
		return getSettings()?.defaultTemplateTypes;
	}, [] );

	const [ hoveredTemplate, setHoveredTemplate ] = useState();

	const onMouseEnterTemplate = ( template ) => setHoveredTemplate( template );
	const onMouseLeaveTemplate = () => setHoveredTemplate( null );

	if ( ! templates ) {
		return null;
	}

	if ( ! Array.isArray( templates ) ) {
		templates = [ templates ];
	}

	return (
		<>
			{ templates.map( ( template ) => {
				const key = `${ entityType }-${ template.id }`;
				const { title, description } = getTemplateInfo(
					template,
					defaultTemplateTypes
				);
				return (
					<NavigationItem
						className="edit-site-navigation-panel__template-item"
						key={ key }
						item={ key }
						title={ title }
					>
						<Button
							onClick={ () => onActivateItem( template.id ) }
							onMouseEnter={ () =>
								onMouseEnterTemplate( template )
							}
							onMouseLeave={ onMouseLeaveTemplate }
						>
							{ title }
							{ description && (
								<div className="edit-site-navigation-panel__template-item-description">
									{ description }
								</div>
							) }
						</Button>
					</NavigationItem>
				);
			} ) }

			{ hoveredTemplate?.content?.raw && (
				<NavigationPanelPreviewFill>
					<TemplatePreview
						rawContent={ hoveredTemplate.content.raw }
					/>
				</NavigationPanelPreviewFill>
			) }
		</>
	);
}
