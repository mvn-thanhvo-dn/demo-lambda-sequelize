import { sequelize } from './shared/configs/database';

sequelize
  .sync()
  .then(() => {
    console.log('con db success');
  })
  .catch((err) => {
    console.log('con db fail');
    console.log(err);
  });

export * from './handlers';
