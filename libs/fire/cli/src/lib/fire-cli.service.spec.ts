import { Test } from '@nestjs/testing';
import { FireCliService } from './fire-cli.service';

describe('FireCliService', () => {
  let service: FireCliService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [FireCliService],
    }).compile();

    service = module.get(FireCliService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
