/**
 * Policy Details Component
 * ServiceNow UI Builder Component for displaying comprehensive policy information
 */

import { createCustomElement } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import styles from './styles.scss';
import view from './view';

createCustomElement('x-dxcis-ins-pol-policy-details', {
	renderer: { type: snabbdom },

	/**
	 * Component properties (inputs)
	 */
	properties: {
		policyId: {
			type: String,
			default: ''
		},
		tableName: {
			type: String,
			default: 'x_dxcis_ins_pol_policy'
		}
	},

	/**
	 * Component state
	 */
	initialState: {
		policy: null,
		loading: true,
		error: null,
		activeService: null // 'beneficiary' | 'address' | 'owner' | 'returnMail'
	},

	/**
	 * Action handlers
	 */
	actionHandlers: {
		/**
		 * Component mounted - load policy
		 */
		['COMPONENT_CONNECTED']: ({ state, dispatch }) => {
			if (state.properties.policyId) {
				dispatch('LOAD_POLICY');
			}
		},

		/**
		 * Load policy details
		 */
		['LOAD_POLICY']: ({ state, dispatch }) => {
			const { policyId, tableName } = state.properties;

			if (!policyId) {
				dispatch('LOAD_POLICY_ERROR', {
					error: 'Policy ID is required'
				});
				return;
			}

			dispatch('FETCH_POLICY', { policyId, tableName });
		},

		/**
		 * Fetch policy via REST API
		 */
		['FETCH_POLICY']: createHttpEffect('/api/now/table/:tableName/:policyId', {
			method: 'GET',
			pathParams: ['tableName', 'policyId'],
			successActionType: 'FETCH_POLICY_SUCCESS',
			errorActionType: 'FETCH_POLICY_ERROR'
		}),

		/**
		 * Handle successful policy fetch
		 */
		['FETCH_POLICY_SUCCESS']: ({ action, updateState }) => {
			const policy = action.payload.result;
			updateState({
				policy,
				loading: false,
				error: null
			});
		},

		/**
		 * Handle policy fetch error
		 */
		['FETCH_POLICY_ERROR']: ({ action, updateState }) => {
			updateState({
				loading: false,
				error: 'Failed to load policy details. Please try again.'
			});
		},

		/**
		 * Set active service action
		 */
		['SET_ACTIVE_SERVICE']: ({ action, updateState }) => {
			const { service } = action.payload;
			updateState({
				activeService: service
			});
		},

		/**
		 * Handle service completion
		 */
		['SERVICE_COMPLETE']: ({ dispatch, updateState }) => {
			updateState({
				activeService: null
			});
			dispatch('LOAD_POLICY'); // Reload policy data
		},

		/**
		 * Handle service cancellation
		 */
		['SERVICE_CANCEL']: ({ updateState }) => {
			updateState({
				activeService: null
			});
		},

		/**
		 * Navigate back to search
		 */
		['NAVIGATE_TO_SEARCH']: ({ dispatch }) => {
			dispatch('NAVIGATE_TO', {
				route: '/'
			});
		}
	},

	/**
	 * View function
	 */
	view,

	/**
	 * Styles
	 */
	styles
});
