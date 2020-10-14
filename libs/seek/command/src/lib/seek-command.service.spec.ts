import { Test } from '@nestjs/testing';
import { SeekCommandService } from './seek-command.service';

describe('SeekCommandService', () => {
  let service: SeekCommandService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SeekCommandService],
    }).compile();

    service = module.get(SeekCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
