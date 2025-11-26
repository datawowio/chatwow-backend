import * as React from 'react';
import { Html } from '@react-email/components';
import { User } from '@domain/base/user/user.domain';
import { UserFactory } from '@domain/base/user/user.factory';

type DefaultProps = {
  user: User;
  url: string;
};

export default function TemplateNewPassword({ user, url }: DefaultProps) {
  user ??= UserFactory.mock({});
  url ??= 'http://localhost:8001';

  return (
    <Html lang="en">
      <a href={`${url}`}>Setup your password</a>
    </Html>
  );
}
