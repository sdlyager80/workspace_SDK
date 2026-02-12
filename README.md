# Insurance Policy Servicing - ServiceNow SDK Version

This is a **native ServiceNow application** built using the **ServiceNow SDK and UI Builder**. It's a refactored version of the standalone React application to validate the ServiceNow SDK approach.

## 🏗️ Architecture

This application uses:
- **ServiceNow SDK** - Native ServiceNow development framework
- **UI Builder** - ServiceNow's component-based UI framework
- **Seismic** - ServiceNow's state management and component architecture
- **ServiceNow Tables** - Native data storage in ServiceNow platform

## 📁 Project Structure

```
workspace_SDK/
├── now.json                          # ServiceNow application manifest
├── package.json                      # Dependencies and scripts
├── src/
│   ├── x-dxcis-ins-pol-policy-search/   # Policy Search UI Component
│   │   ├── index.js                     # Component logic
│   │   ├── view.js                      # Component view template
│   │   └── styles.scss                  # Component styles
│   ├── x-dxcis-ins-pol-policy-details/  # Policy Details UI Component
│   │   ├── index.js                     # Component logic
│   │   ├── view.js                      # Component view template
│   │   └── styles.scss                  # Component styles
│   └── tables/
│       └── x_dxcis_ins_pol_policy.json  # Table definition
└── README.md
```

## 🚀 Getting Started

### Prerequisites

1. **ServiceNow Instance** (PDI or Developer instance)
   - Sign up at: https://developer.servicenow.com/
   - Request a Personal Developer Instance (PDI)

2. **ServiceNow CLI**
   ```bash
   npm install -g @servicenow/cli
   ```

3. **Node.js** >= 18.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sdlyager80/workspace_SDK.git
   cd workspace_SDK
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure ServiceNow CLI**
   ```bash
   snc configure profile set --profile dev-instance
   ```

   You'll be prompted for:
   - Instance URL (e.g., `https://dev12345.service-now.com`)
   - Username (your ServiceNow account)
   - Password

4. **Connect to your instance**
   ```bash
   snc instance connect
   ```

## 📦 Deployment

### Method 1: Using ServiceNow CLI (Recommended)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to ServiceNow**
   ```bash
   npm run deploy
   ```

3. **Access in ServiceNow**
   - Navigate to: **All** > **UI Builder**
   - Open your application: **Insurance Policy Servicing**
   - Or direct URL: `https://YOUR-INSTANCE.service-now.com/now/nav/ui/classic/params/target/x_dxcis_ins_pol`

### Method 2: Using ServiceNow IDE (Visual Studio Code Extension)

1. **Install ServiceNow IDE Extension**
   - Open VS Code
   - Install "ServiceNow Extension Pack"

2. **Connect to Instance**
   - Open Command Palette (Ctrl+Shift+P)
   - Select "ServiceNow: Connect to Instance"
   - Enter instance URL and credentials

3. **Sync Application**
   - Right-click on project folder
   - Select "ServiceNow: Push Application"

### Method 3: Import via Update Set

1. **Export Update Set**
   ```bash
   snc ui-component export
   ```

2. **Import in ServiceNow**
   - Navigate to: **System Update Sets** > **Retrieved Update Sets**
   - Upload the exported XML
   - Preview and commit

## 🗄️ Data Model

The application uses a custom table: `x_dxcis_ins_pol_policy`

### Fields

| Field Name | Type | Description |
|------------|------|-------------|
| policy_number | String | Unique policy identifier |
| policy_type | Choice | LIFE or ANNUITY |
| status | Choice | ACTIVE, PENDING, LAPSED, CANCELLED, PAID_UP |
| product_name | String | Insurance product name |
| face_amount | Decimal | Death benefit amount |
| cash_value | Decimal | Policy cash value |
| premium_amount | Decimal | Premium payment amount |
| owner_first_name | String | Policy owner first name |
| owner_last_name | String | Policy owner last name |
| mailing_street1 | String | Mailing address |
| return_mail_flag | Boolean | Return mail indicator |

### Creating Sample Data

```javascript
// Run in ServiceNow Scripts - Background
var gr = new GlideRecord('x_dxcis_ins_pol_policy');
gr.initialize();
gr.policy_number = 'POL-2024-001';
gr.policy_type = 'LIFE';
gr.status = 'ACTIVE';
gr.product_name = 'Whole Life Premium';
gr.face_amount = 500000;
gr.premium_amount = 250;
gr.premium_frequency = 'MONTHLY';
gr.owner_first_name = 'John';
gr.owner_last_name = 'Smith';
gr.owner_dob = '1980-01-15';
gr.mailing_street1 = '123 Main St';
gr.mailing_city = 'New York';
gr.mailing_state = 'NY';
gr.mailing_zip = '10001';
gr.mailing_country = 'USA';
gr.insert();
```

## 🔧 Development Workflow

### Local Development

```bash
# Start development server with hot reload
npm run dev
```

### Testing Changes

1. Make changes to component files
2. Save (changes auto-reload in dev mode)
3. View changes in ServiceNow instance
4. Iterate

### Building for Production

```bash
npm run build
```

## 📊 Components

### PolicySearch Component
- **Location**: `src/x-dxcis-ins-pol-policy-search/`
- **Purpose**: Search and list insurance policies
- **Features**:
  - Search by policy number, name, SSN
  - Displays policy table with sorting
  - Click row to view details

### PolicyDetails Component
- **Location**: `src/x-dxcis-ins-pol-policy-details/`
- **Purpose**: Display comprehensive policy information
- **Features**:
  - Policy information
  - Financial details
  - Owner information
  - Mailing address
  - Service actions (Beneficiary, Address, Owner changes)

## 🆚 Comparison: SDK vs Embedded React

| Aspect | ServiceNow SDK (This Repo) | Embedded React (Original) |
|--------|----------------------------|---------------------------|
| **Development** | ServiceNow IDE or VS Code with extension | Any IDE (VS Code, WebStorm, etc.) |
| **Deployment** | `npm run deploy` or IDE sync | Manual copy HTML to System Property |
| **Hot Reload** | ✅ Yes (with `npm run dev`) | ✅ Yes (with `npm run dev`) |
| **ServiceNow Integration** | ✅ Native - direct table access | ⚠️ REST API required |
| **Component Library** | ServiceNow Fluent components | Full React ecosystem (any npm package) |
| **Learning Curve** | Steeper (ServiceNow-specific) | Lower (standard React) |
| **Flexibility** | Limited to ServiceNow patterns | Full JavaScript/React flexibility |
| **Version Control** | ✅ Full Git support | ✅ Full Git support |
| **CI/CD** | ✅ ServiceNow CLI automation | Manual or custom scripts |
| **Testing** | ServiceNow test framework | Jest, React Testing Library, etc. |
| **Debugging** | ServiceNow debugger | Browser DevTools |

## 🔐 Security

- Uses ServiceNow's built-in authentication
- Role-based access control (RBAC) via ServiceNow
- ACLs (Access Control Lists) on tables
- Encrypted fields for sensitive data (SSN)

## 📖 Resources

- [ServiceNow Developer Portal](https://developer.servicenow.com/)
- [ServiceNow SDK Documentation](https://developer.servicenow.com/dev.do#!/reference/next-experience/latest/sn-sdk/docs)
- [UI Builder Guide](https://developer.servicenow.com/dev.do#!/reference/next-experience/latest/ui-builder/overview)
- [ServiceNow CLI Reference](https://developer.servicenow.com/dev.do#!/reference/cli/rome/cli-reference)

## 🐛 Troubleshooting

### "No Fluent App Found" in ServiceNow IDE

**Cause**: ServiceNow IDE expects a native ServiceNow app structure, which this repo now has.

**Solution**: Make sure you've run `npm install` and the `now.json` file exists.

### Deployment Fails

1. Check ServiceNow CLI connection:
   ```bash
   snc instance info
   ```

2. Verify credentials:
   ```bash
   snc configure profile list
   ```

3. Check instance status (instance might be hibernated)

### Components Not Showing

1. Verify application is activated in ServiceNow
2. Check user roles (need `x_dxcis_ins_pol.user` role)
3. Clear browser cache

## 📝 Next Steps

1. ✅ Test the SDK deployment process
2. ✅ Compare development experience with React version
3. ⬜ Implement remaining service actions (Beneficiary, Address, Owner changes)
4. ⬜ Add unit tests
5. ⬜ Set up CI/CD pipeline
6. ⬜ Create user documentation

## 🤝 Contributing

This is a proof-of-concept for evaluating ServiceNow SDK approach. Contributions welcome!

## 📄 License

MIT
