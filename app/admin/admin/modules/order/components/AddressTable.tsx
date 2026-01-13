import { Table } from 'react-bootstrap';
import { OrderAddress } from '../models/OrderAddress';
type Props = {
  address: OrderAddress;
  isShowOnGoogleMap: boolean;
};

const AddressTable = ({ address, isShowOnGoogleMap }: Props) => {
  if (!address) return <>No address found</>;
  return (
    <>
      <Table hover>
        <thead>
          <tr>
            <th className="d-flex justify-content-center">Billing address</th>
            <th className="w-50"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="d-flex justify-content-center">Full name</td>
            <td>{address.contactName}</td>
          </tr>
          <tr>
            <td className="d-flex justify-content-center">Phone</td>
            <td>{address.phoneNumber}</td>
          </tr>
          <tr>
            <td className="d-flex justify-content-center">Address spec</td>
            <td>{address.specificAddress}</td>
          </tr>

          <tr>
            <td className="d-flex justify-content-center">District name</td>
            <td>{address.districtName}</td>
          </tr>

          <tr>
            <td className="d-flex justify-content-center">State or province name</td>
            <td>{address.provinceName}</td>
          </tr>
          <tr>
            <td className="d-flex justify-content-center">Country name</td>
            <td>{address.countryName}</td>
          </tr>
          {isShowOnGoogleMap ? (
            <tr>
              <td style={{ cursor: 'pointer' }}>
                <i className="fa fa-map-marker me-3 mt-2" aria-hidden="true"></i>View on Google Maps
              </td>
            </tr>
          ) : (
            <tr>
              <td style={{ height: '40px' }}></td>
            </tr>
          )}

        </tbody>
      </Table>
    </>
  );
};

export default AddressTable;
