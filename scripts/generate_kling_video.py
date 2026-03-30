import os
import sys
import json
import time
import requests

def run():
    if len(sys.argv) < 4:
        print("Usage: python generate_kling_video.py <prompt> <image_url> <output_file> [duration]")
        sys.exit(1)

    prompt = sys.argv[1]
    image_url = sys.argv[2]
    output_file = sys.argv[3]
    duration = sys.argv[4] if len(sys.argv) > 4 else "5"

    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    api_key = None
    with open(env_path, 'r') as f:
        for line in f:
            if line.startswith('KIE_API_KEY=') or line.startswith('KIE_AI_API_KEY='):
                api_key = line.strip().split('=', 1)[1].strip('"\'')
                break

    if not api_key:
        print("ERROR: API key not found in .env")
        sys.exit(1)

    url = "https://api.kie.ai/api/v1/jobs/createTask"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "kling/v2-1-master-image-to-video",
        "input": {
            "prompt": prompt,
            "image_url": image_url,
            "duration": duration,
            "negative_prompt": "blur, distort, low quality, jittery motion, morphing artifacts, deformed products, text changes, logo distortion",
            "cfg_scale": 0.5
        }
    }

    print(f"Creating Kling video task...")
    print(f"Image: {image_url}")
    print(f"Duration: {duration}s")
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
    except Exception as e:
        print(f"ERROR creating task: {e}")
        if 'response' in locals() and response is not None:
            print(response.text)
        sys.exit(1)

    if result.get("code") != 200:
        print(f"ERROR: API returned code {result.get('code')}: {result.get('msg')}")
        sys.exit(1)

    task_id = result.get("data", {}).get("taskId")
    if not task_id:
        print("ERROR: No taskId returned")
        print(result)
        sys.exit(1)

    print(f"Task created: {task_id}. Polling (video takes 1-5 min)...")

    poll_url = "https://api.kie.ai/api/v1/jobs/recordInfo"
    poll_params = {"taskId": task_id}

    attempts = 0
    while attempts < 120:  # up to 10 min
        time.sleep(5)
        attempts += 1

        try:
            poll_resp = requests.get(poll_url, headers=headers, params=poll_params, timeout=15)
            poll_resp.raise_for_status()
            poll_result = poll_resp.json()
        except Exception as e:
            print(f"Poll {attempts} Error: {e}")
            continue

        data = poll_result.get("data", {})
        state = data.get("state")

        if attempts % 6 == 0:  # print every 30s
            print(f"Poll {attempts}: state = {state}")

        if state in ("success", "completed"):
            result_json_str = data.get("resultJson", "{}")
            try:
                result_json = json.loads(result_json_str)
            except json.JSONDecodeError:
                result_json = {}

            # Video URLs might be in resultUrls or works
            result_urls = result_json.get("resultUrls", [])
            works = result_json.get("works", [])

            video_url = None
            if result_urls:
                video_url = result_urls[0]
            elif works:
                video_url = works[0].get("resource", {}).get("resource")

            if video_url:
                print(f"Downloading video from {video_url}")
                try:
                    vid_resp = requests.get(video_url, timeout=120)
                    vid_resp.raise_for_status()
                    os.makedirs(os.path.dirname(output_file) or '.', exist_ok=True)
                    with open(output_file, 'wb') as f:
                        f.write(vid_resp.content)
                    print(f"Successfully saved to {output_file}")
                    sys.exit(0)
                except Exception as e:
                    print(f"ERROR downloading video: {e}")
                    sys.exit(1)
            else:
                print("SUCCESS but no video URL found. Full response:")
                print(json.dumps(data, indent=2))
                sys.exit(1)

        elif state in ("fail", "failed", "error"):
            print(f"ERROR: Task failed. Details:")
            print(json.dumps(data, indent=2))
            sys.exit(1)

    print("ERROR: Timed out after 10 minutes")
    sys.exit(1)

if __name__ == "__main__":
    run()
