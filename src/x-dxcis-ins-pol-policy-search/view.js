/**
 * Policy Search View
 * Declarative view template for the policy search component
 */

export default (state, { updateState, dispatch }) => {
	const { policies, loading, error, searchCriteria } = state;

	return (
		<div className="policy-search-container">
			{/* Search Form */}
			<div className="search-card">
				<h2 className="card-header">Search Policies</h2>

				<div className="form-grid">
					{/* Policy Number */}
					<div className="form-group">
						<label className="form-label">Policy Number</label>
						<input
							type="text"
							className="form-input"
							value={searchCriteria.policyNumber}
							placeholder="Enter policy number"
							on-input={(e) => dispatch('SEARCH_INPUT_CHANGED', {
								field: 'policyNumber',
								value: e.target.value
							})}
						/>
					</div>

					{/* Last Name */}
					<div className="form-group">
						<label className="form-label">Last Name</label>
						<input
							type="text"
							className="form-input"
							value={searchCriteria.lastName}
							placeholder="Enter last name"
							on-input={(e) => dispatch('SEARCH_INPUT_CHANGED', {
								field: 'lastName',
								value: e.target.value
							})}
						/>
					</div>

					{/* First Name */}
					<div className="form-group">
						<label className="form-label">First Name</label>
						<input
							type="text"
							className="form-input"
							value={searchCriteria.firstName}
							placeholder="Enter first name"
							on-input={(e) => dispatch('SEARCH_INPUT_CHANGED', {
								field: 'firstName',
								value: e.target.value
							})}
						/>
					</div>

					{/* SSN */}
					<div className="form-group">
						<label className="form-label">SSN (Last 4)</label>
						<input
							type="text"
							className="form-input"
							value={searchCriteria.ssn}
							placeholder="Last 4 digits"
							maxLength="4"
							on-input={(e) => dispatch('SEARCH_INPUT_CHANGED', {
								field: 'ssn',
								value: e.target.value
							})}
						/>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="btn-group">
					<button
						className="btn btn-primary"
						disabled={loading}
						on-click={() => dispatch('SEARCH_POLICIES')}
					>
						{loading ? 'Searching...' : 'Search'}
					</button>
					<button
						className="btn btn-secondary"
						on-click={() => dispatch('RESET_SEARCH')}
					>
						Reset
					</button>
				</div>
			</div>

			{/* Error Message */}
			{error && (
				<div className="alert alert-error">
					{error}
				</div>
			)}

			{/* Loading State */}
			{loading && (
				<div className="loading-container">
					<div className="spinner"></div>
					<p>Loading policies...</p>
				</div>
			)}

			{/* Results Table */}
			{!loading && policies.length > 0 && (
				<div className="results-card">
					<h3 className="card-header">
						Search Results ({policies.length})
					</h3>

					<div className="table-wrapper">
						<table className="policy-table">
							<thead>
								<tr>
									<th>Policy Number</th>
									<th>Type</th>
									<th>Status</th>
									<th>Owner Name</th>
									<th>Product</th>
									<th>Premium</th>
									<th>Return Mail</th>
								</tr>
							</thead>
							<tbody>
								{policies.map((policy) => (
									<tr
										key={policy.sys_id}
										className="clickable-row"
										on-click={() => dispatch('VIEW_POLICY_DETAILS', {
											policyId: policy.sys_id
										})}
									>
										<td>{policy.policy_number}</td>
										<td>{policy.policy_type}</td>
										<td>
											<span className={`badge badge-${getStatusClass(policy.status)}`}>
												{policy.status}
											</span>
										</td>
										<td>
											{policy.owner_first_name} {policy.owner_last_name}
										</td>
										<td>{policy.product_name}</td>
										<td>
											${Number(policy.premium_amount).toLocaleString()} / {policy.premium_frequency}
										</td>
										<td>
											<span className={`badge ${policy.return_mail_flag ? 'badge-danger' : 'badge-success'}`}>
												{policy.return_mail_flag ? 'Yes' : 'No'}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* No Results */}
			{!loading && policies.length === 0 && (
				<div className="no-results">
					<p>No policies found. Try adjusting your search criteria.</p>
				</div>
			)}
		</div>
	);
};

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
