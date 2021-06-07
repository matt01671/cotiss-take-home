import React from 'react';
import { Modal } from 'semantic-ui-react';

export default function CategoryInfoModal(props) {
  const { open, toggle } = props;
  return (
    <Modal
      dimmer="blurring"
      size="small"
      open={open}
      onClose={() => toggle()}
    >
      <Modal.Header>Categories available when searching for a tender</Modal.Header>
      <Modal.Content>
        <h5>
          How are tenders categorised?
        </h5>
        <p>
          The United Nations Standard Products and Services Code (UNSPSC) is a
          hierarchical convention that is used to classify all products and services.
          It is the most efficient, accurate and flexible classification system available
          today for achieving company-wide visibility of spend analysis, enabling procurement
          to deliver on cost-effectiveness demands and allowing full exploitation of electronic
          commerce capabilities.
        </p>
        <a href="https://www.unspsc.org/faqs#Should%20UNSPSC%20be%20used%20in%20our%20company" rel="noopener noreferrer" target="_blank">See here for more information</a>
      </Modal.Content>
      <Modal.Actions>
        <button onClick={() => toggle()}>Done</button>
      </Modal.Actions>
    </Modal>
  );
}
