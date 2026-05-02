import { createLocalDrawingRepository } from './localDrawingRepository.js';
import { createMysqlDrawingRepository } from './mysqlDrawingRepository.js';

let repositoryPromise = null;

export async function getDrawingRepository() {
  if (repositoryPromise) {
    return repositoryPromise;
  }

  repositoryPromise = (async () => {
    const mysqlRepository = await createMysqlDrawingRepository();
    if (mysqlRepository) {
      return mysqlRepository;
    }

    return createLocalDrawingRepository();
  })();

  return repositoryPromise;
}

export async function getDrawingRepositoryMode() {
  const repository = await getDrawingRepository();
  return repository?.mode || 'unknown';
}
