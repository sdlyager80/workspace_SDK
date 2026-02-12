/**
 * Policy Details View
 * Declarative view template for the policy details component
 */

export default (state, { dispatch }) => {
	const { policy, loading, error, activeService } = state;

	// Loading state
	if (loading) {
		return (
			<div className="loading-container">
				<div className="spinner"></div>
				<p>Loading policy details...</p>
			</div>
		);
	}

	// Error state
	if (error || !policy) {
		return (
			<div className="error-card">
				<div className="alert alert-error">{error || 'Policy not found'}</div>
				<button
					className="btn btn-secondary"
					on-click={() => dispatch('NAVIGATE_TO_SEARCH')}
				>
					Back to Search
				</button>
			</div>
		);
	}

	// Service action views
	if (activeService) {
		return renderServiceAction(activeService, policy, dispatch);
	}

	// Main policy details view
	return (
		<div className="policy-details-container">
			{/* Header */}
			<div className="details-header">
				<h2>Policy Details</h2>
				<button
					className="btn btn-secondary"
					on-click={() => dispatch('NAVIGATE_TO_SEARCH')}
				>
					Back to Search
				</button>
			</div>

			{/* Policy Information */}
			<div className="info-card">
				<h3 className="card-header">Policy Information</h3>
				<div className="info-grid">
					<InfoField label="Policy Number" value={policy.policy_number} />
					<InfoField label="Policy Type" value={policy.policy_type} />
					<InfoField label="Status">
						<span className={`badge badge-${getStatusClass(policy.status)}`}>
							{policy.status}
						</span>
					</InfoField>
					<InfoField label="Product Name" value={policy.product_name} />
					<InfoField label="Issue Date" value={formatDate(policy.issue_date)} />
					<InfoField label="Effective Date" value={formatDate(policy.effective_date)} />
				</div>
			</div>

			{/* Financial Information */}
			<div className="info-card">
				<h3 className="card-header">Financial Information</h3>
				<div className="info-grid">
					{policy.face_amount && (
						<InfoField label="Face Amount" value={`$${Number(policy.face_amount).toLocaleString()}`} />
					)}
					{policy.cash_value && (
						<InfoField label="Cash Value" value={`$${Number(policy.cash_value).toLocaleString()}`} />
					)}
					<InfoField
						label="Premium Amount"
						value={`$${Number(policy.premium_amount).toLocaleString()} / ${policy.premium_frequency}`}
					/>
				</div>
			</div>

			{/* Owner Information */}
			<div className="info-card">
				<h3 className="card-header">Owner Information</h3>
				<div className="info-grid">
					<InfoField
						label="Name"
						value={`${policy.owner_first_name} ${policy.owner_middle_name || ''} ${policy.owner_last_name}`.trim()}
					/>
					<InfoField label="Date of Birth" value={formatDate(policy.owner_dob)} />
					{policy.owner_email && (
						<InfoField label="Email" value={policy.owner_email} />
					)}
					{policy.owner_phone && (
						<InfoField label="Phone" value={policy.owner_phone} />
					)}
				</div>
			</div>

			{/* Mailing Address */}
			<div className="info-card">
				<h3 className="card-header">Mailing Address</h3>
				<div className="address-content">
					<p>{policy.mailing_street1}</p>
					{policy.mailing_street2 && <p>{policy.mailing_street2}</p>}
					<p>
						{policy.mailing_city}, {policy.mailing_state} {policy.mailing_zip}
					</p>
					<p>{policy.mailing_country}</p>
				</div>
				{policy.return_mail_flag && (
					<div className="alert alert-error" style="margin-top: 16px;">
						<strong>Return Mail Flag:</strong> Mail returned on{' '}
						{formatDate(policy.return_mail_date)}
						{policy.return_mail_reason && ` - ${policy.return_mail_reason}`}
					</div>
				)}
			</div>

			{/* Servicing Actions */}
			<div className="info-card">
				<h3 className="card-header">Policy Servicing Actions</h3>
				<p className="help-text">Select a servicing action to perform:</p>
				<div className="action-buttons">
					<button
						className="btn btn-primary"
						on-click={() => dispatch('SET_ACTIVE_SERVICE', { service: 'beneficiary' })}
					>
						Beneficiary Change
					</button>
					<button
						className="btn btn-primary"
						on-click={() => dispatch('SET_ACTIVE_SERVICE', { service: 'address' })}
					>
						Address Change
					</button>
					<button
						className="btn btn-primary"
						on-click={() => dispatch('SET_ACTIVE_SERVICE', { service: 'owner' })}
					>
						Owner Change
					</button>
					{policy.return_mail_flag && (
						<button
							className="btn btn-danger"
							on-click={() => dispatch('SET_ACTIVE_SERVICE', { service: 'returnMail' })}
						>
							Handle Return Mail
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

/**
 * InfoField component
 */
function InfoField({ label, value, children }) {
	return (
		<div className="info-field">
			<label className="info-label">{label}</label>
			<div className="info-value">{children || value}</div>
		</div>
	);
}

/**
 * Render service action view (placeholder)
 */
function renderServiceAction(service, policy, dispatch) {
	const serviceLabels = {
		beneficiary: 'Beneficiary Change',
		address: 'Address Change',
		owner: 'Owner Change',
		returnMail: 'Return Mail Handling'
	};

	return (
		<div className="service-action-container">
			<div className="info-card">
				<h3 className="card-header">{serviceLabels[service]}</h3>
				<p className="help-text">
					Service action form would be implemented here for {serviceLabels[service].toLowerCase()}.
				</p>
				<div className="action-buttons">
					<button
						className="btn btn-primary"
						on-click={() => dispatch('SERVICE_COMPLETE')}
					>
						Complete
					</button>
					<button
						className="btn btn-secondary"
						on-click={() => dispatch('SERVICE_CANCEL')}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}

/**
 * Helper function to format dates
 */
function formatDate(dateString) {
	if (!dateString) return '';
	return new Date(dateString).toLocaleDateString();
}

/**
 * Helper function to get status badge class
 */
function getStatusClass(status) {
	const statusMap = {
		'ACTIVE': 'success',
		'PENDING': 'warning',
		'LAPSED': 'danger',
		'CANCELLED': 'danger',
		'PAID_UP': 'info'
	};
	return statusMap[status] || 'info';
}
