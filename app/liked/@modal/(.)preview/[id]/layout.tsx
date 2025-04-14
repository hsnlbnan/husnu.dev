import React, { ReactNode } from 'react';

type LayoutProps = {
  children?: React.ReactNode
}

type LayoutPropsExtended = {
  children: React.ReactNode
  modal: React.ReactNode
}

export default function Layout(props: LayoutProps | LayoutPropsExtended): JSX.Element {
  // Check if props has modal property to determine if it's LayoutPropsExtended
  const isLayoutPropsExtended = (props: LayoutProps | LayoutPropsExtended): props is LayoutPropsExtended => {
    return 'modal' in props;
  };

  return (
    <>
      {props.children}
      {isLayoutPropsExtended(props) && props.modal}
    </>
  );
}