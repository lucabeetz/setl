import asyncio
from pathlib import Path
import subprocess
from typing import Callable, List, Optional, Union

import lmql
from dotenv import load_dotenv

load_dotenv()


grey = "\x1b[38;20m"
yellow = "\x1b[33;20m"
red = "\x1b[31;20m"
green = "\x1b[32;20m"
blue = "\x1b[34;20m"
col = "\x1b[35;20m"
bold_red = "\x1b[31;1m"
reset = "\x1b[0m"


def bash_process(commands: Union[str, List[str]]) -> str:
    """Run commands and return final output."""
    if isinstance(commands, str):
        commands = [commands]
    commands = ";".join(commands)
    try:
        output = subprocess.check_output(
            commands, shell=True, stderr=subprocess.PIPE).decode()
    except subprocess.CalledProcessError as error:
        return str(error.stderr.decode('utf-8'))
    return output


def _tool_entry(tool: Callable) -> str:
    return f"""{tool.__name__}: {tool.__doc__}"""


def tool_template(tools: List) -> str:
    return "\n".join([_tool_entry(t) for t in tools])


def tool_names(tools: List) -> str:
    return ", ".join([t.__name__ for t in tools])


tools = [bash_process]


@lmql.query
async def ffmpeg_agent(task: str, file: str, output_folder: Path, previous: Optional[str] = None, feedback: Optional[str] = None):
    '''lmql
    argmax(max_len=10000, step_budget=20000, openai_chunksize=128)
        """
        You are an expert FFMPEG user. You are tasked with the following task:
        {task}

        The input file is at:
        {file}

        The outputs should be put in the following folder:
        {output_folder}


        The ffmpeg docs are:
        """
        f"{bash_process('ffmpeg -h')}"

        """
        You have access to the following tool:

        bash_process - Run bash commands and return final output

        You should use this tool to find the right commands to run to complete the task (e.g. by using -h)


        Use the following format:

        Question: the input question you must answer
        Thought: you should always think about what to do
        Action: the action to take, should be one of {tool_names(tools)}
        Action Input: the input to the action surrounded by triple backticks (```)
        Observation: the result of the action
        ... (this Thought/Action/Action Input/Observation can repeat N times)
        Thought: I now know the final answer
        Final Answer: the final answer to the original input question
        """
        if previous:
            """
            We tried running this command:
            {previous}

            This executed successfully but we got the following feedback from the user:
            {feedback}

            You should take this feedback and fix the command
            """

        """
        Begin!

        Question: {task}
        """
        for i in range(100):
            "Thought:[THOUGHT]\n"
            print(f"Had thought: {red}{THOUGHT.strip()}{reset}")

            "[ACTION_OR_ANSWER][ACTION_OR_ANSWER_OUTPUT]\n"
            action_or_answer = ACTION_OR_ANSWER.strip()
            print(f"Action/answer: {green}{action_or_answer}{reset}")

            if action_or_answer == "Action:":
                cleaned_action = ACTION_OR_ANSWER_OUTPUT.strip()
                print(f"Baby it's an action: {green}{cleaned_action}{reset}")

                "Action Input: ```[ACTION_INPUT]```"
                cleaned_input = ACTION_INPUT.strip().strip('```').strip()
                print(f"With the input: \n{yellow}{cleaned_input}{reset}")

                tool_names_to_tool = {t.__name__: t for t in tools}
                if cleaned_action in tool_names_to_tool:
                    result = tool_names_to_tool[cleaned_action](cleaned_input)
                    result += f"\nThe contents of the output folder are: {', '.join([str(p.name) for p in output_folder.iterdir()])}"
                    print(f"Observed: {blue}'{result}'{reset}")
                else:
                    result = f"'{cleaned_action}' is not a valid action, actions should be one of: {tool_names(tools)}"
                "\nObservation: {result}\n"
            elif action_or_answer == "Final Answer:":
                break
            else:
                print(f"Expected 'Action' or 'Final Answer'")

    from
        "gpt-4"
    where
        STOPS_AT(THOUGHT, "\n") and
        STOPS_AT(ACTION_OR_ANSWER, ":") and
        STOPS_AT(ACTION_OR_ANSWER_OUTPUT, "\n") and
        STOPS_AT(ACTION_INPUT, "```")
    '''


async def main():
    task = "Split this file into 10s chunks"
    file = "/Users/robertchandler/Downloads/Laura St. John Manifestation course/Lesson8_ReleaseHow.MOV"

    previous = "ffmpeg -i /Users/robertchandler/Downloads/Laura\ St.\ John\ Manifestation\ course/Lesson8_ReleaseHow.MOV -c copy -map 0 -segment_time 10 -f segment /Users/robertchandler/code/ai/CodeGenHack/agent/src/agent/output/output%03d.MOV"
    feedback = "The outputs were just black and the chunks get longer and longer"

    print("******* RESULT *********\n", (await ffmpeg_agent(task, file, previous, feedback))[0].prompt)


if __name__ == '__main__':
    asyncio.run(main())
