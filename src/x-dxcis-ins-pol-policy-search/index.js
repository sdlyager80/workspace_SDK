/**
 * Policy Search Component
 * ServiceNow UI Builder Component for searching insurance policies
 */

import { createCustomElement } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import styles from './styles.scss';
import view from './view';

createCustomElement('x-dxcis-ins-pol-policy-search', {
	renderer: { type: snabbdom },

	/**
	 * Component properties (inputs)
	 */
	properties: {
		instanceUrl: {
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
		policies: [],
		loading: false,
		error: null,
		searchCriteria: {
			policyNumber: '',
			lastName: '',
			firstName: '',
			ssn: ''
		}
	},

	/**
	 * Action handlers
	 */
	actionHandlers: {
		/**
		 * Handle input changes in search form
		 */
		[`SEARCH_INPUT_CHANGED`]: ({ action, updateState }) => {
			const { field, value } = action.payload;
			updateState({
				searchCriteria: {
					[field]: value
				}
			});
		},

		/**
		 * Search for policies
		 */
		[`SEARCH_POLICIES`]: ({ state, updateState, dispatch }) => {
			updateState({ loading: true, error: null });

			// Build query parameters
			const { searchCriteria } = state;
			const params = new URLSearchParams();

			if (searchCriteria.policyNumber) {
				params.append('sysparm_query', `policy_number=${searchCriteria.policyNumber}`);
			}
			if (searchCriteria.lastName) {
				params.append('sysparm_query', `owner_last_name=${searchCriteria.lastName}`);
			}
			if (searchCriteria.firstName) {
				params.append('sysparm_query', `owner_first_name=${searchCriteria.firstName}`);
			}

			// Dispatch HTTP effect to fetch policies
			dispatch('FETCH_POLICIES', { params: params.toString() });
		},

		/**
		 * Fetch policies via REST API
		 */
		[`FETCH_POLICIES`]: createHttpEffect('/api/now/table/:tableName', {
			method: 'GET',
			pathParams: ['tableName'],
			queryParams: ['params'],
			successActionType: 'FETCH_POLICIES_SUCCESS',
			errorActionType: 'FETCH_POLICIES_ERROR'
		}),

		/**
		 * Handle successful policy fetch
		 */
		[`FETCH_POLICIES_SUCCESS`]: ({ action, updateState }) => {
			const policies = action.payload.result;
			updateState({
				policies,
				loading: false,
				error: null
			});
		},

		/**
		 * Handle policy fetch error
		 */
		[`FETCH_POLICIES_ERROR`]: ({ action, updateState }) => {
			updateState({
				loading: false,
				error: 'Failed to fetch policies. Please try again.'
			});
		},

		/**
		 * Reset search form
		 */
		[`RESET_SEARCH`]: ({ updateState }) => {
			updateState({
				searchCriteria: {
					policyNumber: '',
					lastName: '',
					firstName: '',
					ssn: ''
				},
				policies: [],
				error: null
			});
		},

		/**
		 * Navigate to policy details
		 */
		[`VIEW_POLICY_DETAILS`]: ({ action, dispatch }) => {
			const { policyId } = action.payload;
			dispatch('NAVIGATE_TO', {
				route: `/policy/${policyId}`
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
