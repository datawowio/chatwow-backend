import { AiModel } from '@domain/base/ai-model/ai-model.domain';
import {
  AiModelClaudeConfig,
  AiModelOpenAiConfig,
} from '@domain/base/ai-model/ai-model.type';
import { AiUsageToken } from '@domain/base/ai-usage-token/ai-usage-token.domain';
import { match } from 'ts-pattern';

import { newBig } from '@shared/common/common.func';

import { ModelCalculatorFunc } from './ai-pricing.type';

export function getAiCalculator(aiModel: AiModel) {
  return (
    match(aiModel.provider)
      //
      .returnType<ModelCalculatorFunc>()
      .with('openai', () => {
        return (aiUsageToken: AiUsageToken) =>
          calcOpenAiPrice(aiUsageToken, aiModel.config as AiModelOpenAiConfig);
      })
      .with('claude', () => {
        return (aiUsageToken: AiUsageToken) =>
          calcClaudePrice(aiUsageToken, aiModel.config as AiModelClaudeConfig);
      })
      .exhaustive()
  );
}

const MILLION = 1_000_000;

function calcOpenAiPrice(
  aiUsageToken: AiUsageToken,
  config: AiModelOpenAiConfig,
) {
  const inputRate = newBig(config.inputRatePerMil).div(MILLION);
  const cachedInputRate = newBig(config.cachedInputRatePerMil).div(MILLION);
  const outputRate = newBig(config.outputRatePerMil).div(MILLION);

  const totalPrice = newBig(0)
    // input tokens
    .add(inputRate.mul(aiUsageToken.inputTokens))
    // cache input tokens
    .add(
      cachedInputRate
        .mul(aiUsageToken.cacheCreationInputTokens)
        .add(cachedInputRate.mul(aiUsageToken.cacheReadInputTokens)),
    )
    // output tokens
    .add(outputRate.mul(aiUsageToken.outputTokens));

  return totalPrice;
}

function calcClaudePrice(
  aiUsageToken: AiUsageToken,
  config: AiModelClaudeConfig,
) {
  const inputRate = newBig(config.inputRatePerMil).div(MILLION);
  const outputRate = newBig(config.outputRatePerMil).div(MILLION);
  const cachedReadRate = newBig(config.cachedReadRatePerMil).div(MILLION);
  const cachedWriteRate = newBig(config.cachedWriteRatePerMil).div(MILLION);

  const totalPrice = newBig(0)
    // input tokens
    .add(inputRate.mul(aiUsageToken.inputTokens))
    // output tokens
    .add(outputRate.mul(aiUsageToken.outputTokens))
    // cache write tokens
    .add(cachedWriteRate.mul(aiUsageToken.cacheCreationInputTokens))
    // cache read tokens
    .add(cachedReadRate.mul(aiUsageToken.cacheReadInputTokens));

  return totalPrice;
}
